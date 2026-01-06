# Claude Code Hook - 권한 요청 시 트레이 알림 + 클릭 시 해당 에디터 창으로 포커스
# - EnumWindows API로 정확한 프로젝트 창 찾기
# - stderr 금지: 훅 실패로 잡힘 -> 조용히 exit 0

$ErrorActionPreference = "Stop"

#region 디버그 로깅
$script:logFile = "$PSScriptRoot\debug-focus.log"
function Write-DebugLog {
    param([string]$Message)
    try {
        "[$(Get-Date -Format 'HH:mm:ss.fff')] $Message" | Out-File $script:logFile -Append -Encoding UTF8
    } catch {}
}
#endregion

#region 헬퍼 함수
function Get-PropValue {
    param($Obj, [string]$Name)
    if ($null -eq $Obj) { return $null }
    $p = $Obj.PSObject.Properties[$Name]
    if ($null -eq $p) { return $null }
    return $p.Value
}

function Get-DeepValue {
    param($Obj, [string[]]$Path)
    $cur = $Obj
    foreach ($k in $Path) {
        $cur = Get-PropValue -Obj $cur -Name $k
        if ($null -eq $cur) { return $null }
    }
    return $cur
}
#endregion

#region 환경 체크
if (-not $IsWindows) { exit 0 }

try {
    Add-Type -AssemblyName System.Windows.Forms -ErrorAction Stop
    Add-Type -AssemblyName System.Drawing -ErrorAction Stop
} catch { exit 0 }
#endregion

#region Win32 API
Add-Type @"
using System;
using System.Runtime.InteropServices;
using System.Text;

public class Win32Focus {
    // 콘솔/스레드
    [DllImport("kernel32.dll")] public static extern IntPtr GetConsoleWindow();
    [DllImport("kernel32.dll")] public static extern uint GetCurrentThreadId();

    // 창 제어
    [DllImport("user32.dll")] public static extern bool SetForegroundWindow(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool ShowWindowAsync(IntPtr hWnd, int nCmdShow);
    [DllImport("user32.dll")] public static extern bool IsIconic(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool BringWindowToTop(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern bool IsWindowVisible(IntPtr hWnd);
    [DllImport("user32.dll")] public static extern uint GetWindowThreadProcessId(IntPtr hWnd, out uint pid);
    [DllImport("user32.dll")] public static extern IntPtr GetForegroundWindow();
    [DllImport("user32.dll")] public static extern bool AttachThreadInput(uint idAttach, uint idAttachTo, bool fAttach);
    [DllImport("user32.dll")] public static extern void keybd_event(byte bVk, byte bScan, int dwFlags, int dwExtraInfo);

    // EnumWindows
    public delegate bool EnumWindowsProc(IntPtr hWnd, IntPtr lParam);
    [DllImport("user32.dll")] public static extern bool EnumWindows(EnumWindowsProc lpEnumFunc, IntPtr lParam);
    [DllImport("user32.dll", CharSet = CharSet.Unicode)] public static extern int GetWindowText(IntPtr hWnd, StringBuilder sb, int nMaxCount);
    [DllImport("user32.dll")] public static extern int GetWindowTextLength(IntPtr hWnd);

    public const int SW_RESTORE = 9;
    public const int SW_SHOW = 5;
    public const int KEYEVENTF_KEYUP = 0x0002;
    public const byte VK_MENU = 0x12;

    /// <summary>창 제목에서 폴더명과 에디터명이 모두 포함된 창 찾기</summary>
    public static IntPtr FindWindowByTitle(string folderName) {
        IntPtr result = IntPtr.Zero;
        EnumWindows((hWnd, lParam) => {
            if (!IsWindowVisible(hWnd)) return true;

            int len = GetWindowTextLength(hWnd);
            if (len == 0) return true;

            var sb = new StringBuilder(len + 1);
            GetWindowText(hWnd, sb, sb.Capacity);
            string title = sb.ToString();

            if ((title.Contains("Cursor") || title.Contains("Visual Studio Code")) &&
                title.Contains(folderName)) {
                result = hWnd;
                return false;
            }
            return true;
        }, IntPtr.Zero);
        return result;
    }
}
"@
#endregion

#region 포커스 함수
function Set-WindowFocus {
    param([IntPtr]$hWnd)
    if ($hWnd -eq [IntPtr]::Zero) { return }

    # 최소화 복원
    if ([Win32Focus]::IsIconic($hWnd)) {
        [void][Win32Focus]::ShowWindowAsync($hWnd, [Win32Focus]::SW_RESTORE)
    } else {
        [void][Win32Focus]::ShowWindowAsync($hWnd, [Win32Focus]::SW_SHOW)
    }

    # ALT 키로 Foreground lock 우회
    [Win32Focus]::keybd_event([Win32Focus]::VK_MENU, 0, 0, 0)
    [Win32Focus]::keybd_event([Win32Focus]::VK_MENU, 0, [Win32Focus]::KEYEVENTF_KEYUP, 0)

    # 스레드 연결로 포커스 강제
    $fg = [Win32Focus]::GetForegroundWindow()
    $curThread = [Win32Focus]::GetCurrentThreadId()
    [uint32]$fgPid = 0; [uint32]$targetPid = 0
    $fgThread = if ($fg -ne [IntPtr]::Zero) { [Win32Focus]::GetWindowThreadProcessId($fg, [ref]$fgPid) } else { 0 }
    $targetThread = [Win32Focus]::GetWindowThreadProcessId($hWnd, [ref]$targetPid)

    try {
        if ($fgThread -ne 0) { [void][Win32Focus]::AttachThreadInput($curThread, $fgThread, $true) }
        if ($targetThread -ne 0) { [void][Win32Focus]::AttachThreadInput($curThread, $targetThread, $true) }
        [void][Win32Focus]::BringWindowToTop($hWnd)
        [void][Win32Focus]::SetForegroundWindow($hWnd)
    } finally {
        if ($targetThread -ne 0) { [void][Win32Focus]::AttachThreadInput($curThread, $targetThread, $false) }
        if ($fgThread -ne 0) { [void][Win32Focus]::AttachThreadInput($curThread, $fgThread, $false) }
    }
}

function Find-AnyEditorWindow {
    $p = Get-Process -Name 'Cursor','Code' -ErrorAction SilentlyContinue |
        Where-Object { $_.MainWindowHandle -ne [IntPtr]::Zero -and $_.MainWindowTitle } |
        Sort-Object StartTime -Descending |
        Select-Object -First 1
    if ($p) { return $p.MainWindowHandle }
    return [IntPtr]::Zero
}
#endregion

#region 메인 로직
try {
    $inputJson = [Console]::In.ReadToEnd()
    if ([string]::IsNullOrWhiteSpace($inputJson)) { exit 0 }

    $hookData = $inputJson | ConvertFrom-Json

    # 페이로드 파싱
    $toolName = (Get-PropValue $hookData "tool_name") ??
                (Get-DeepValue $hookData @("tool","name")) ??
                (Get-PropValue $hookData "name") ?? "hook"

    $toolInput = (Get-PropValue $hookData "tool_input") ??
                 (Get-PropValue $hookData "input") ?? $null

    $cwd = (Get-PropValue $hookData "cwd") ??
           (Get-PropValue $hookData "workdir") ?? $null

    $notificationMessage = Get-PropValue $hookData "message"

    $folderName = $null
    if ($cwd) {
        try { $folderName = Split-Path ($cwd.Replace('/', '\').TrimEnd('\')) -Leaf } catch {}
    }

    # 타겟 창 찾기 (우선순위: EnumWindows > 아무 에디터 > 콘솔)
    Write-DebugLog "=== 타겟 핸들 결정 시작 ==="
    $consoleHandle = [Win32Focus]::GetConsoleWindow()
    $targetHandle = [IntPtr]::Zero

    if ($folderName) {
        $targetHandle = [Win32Focus]::FindWindowByTitle($folderName)
        Write-DebugLog "  1. EnumWindows('$folderName'): $targetHandle"
    }
    if ($targetHandle -eq [IntPtr]::Zero) {
        $targetHandle = Find-AnyEditorWindow
        Write-DebugLog "  2. AnyEditorWindow: $targetHandle"
    }
    if ($targetHandle -eq [IntPtr]::Zero) {
        $targetHandle = $consoleHandle
        Write-DebugLog "  3. ConsoleWindow: $targetHandle"
    }
    Write-DebugLog "  => 최종: $targetHandle"

    # 알림 메시지 구성
    $title = if ($folderName) { "[$folderName] 권한 요청" } else { "Claude Code - 권한 요청" }
    $message = if ($notificationMessage) { $notificationMessage }
               elseif ($toolInput) {
                   $cmd = Get-PropValue $toolInput "command"
                   $fp = Get-PropValue $toolInput "file_path"
                   if ($cmd) { "$toolName`: $($cmd.ToString().Substring(0, [Math]::Min(80, $cmd.Length)))" }
                   elseif ($fp) { "$toolName`: $fp" }
                   else { "도구: $toolName" }
               } else { "도구: $toolName" }

    # 트레이 알림 표시
    $notify = New-Object System.Windows.Forms.NotifyIcon
    $notify.Icon = [System.Drawing.SystemIcons]::Warning
    $notify.Visible = $true
    $notify.BalloonTipTitle = $title
    $notify.BalloonTipText = $message
    $notify.BalloonTipIcon = [System.Windows.Forms.ToolTipIcon]::Warning

    $notify.Add_BalloonTipClicked({
        Write-DebugLog "=== 알림 클릭됨 ==="
        Write-DebugLog "  클릭 시점 targetHandle: $targetHandle"
        Start-Sleep -Milliseconds 150
        if ($targetHandle -ne [IntPtr]::Zero) {
            Write-DebugLog "  Focus-Window 호출: $targetHandle"
            Set-WindowFocus -hWnd $targetHandle
            Write-DebugLog "  Focus-Window 완료"
        }
    })

    $notify.ShowBalloonTip(5000)

    # 메시지 루프 (6.5초 후 종료)
    $timer = New-Object System.Windows.Forms.Timer
    $timer.Interval = 6500
    $timer.Add_Tick({ $timer.Stop(); [System.Windows.Forms.Application]::ExitThread() })
    $timer.Start()
    [System.Windows.Forms.Application]::Run()

    $notify.Dispose()
    exit 0
}
catch { exit 0 }
#endregion
