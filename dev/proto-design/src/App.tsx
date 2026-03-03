import { BattleScreen } from './components/screens/BattleScreen';
import { SettingsModal } from './components/ui/SettingsModal';

// [DEV] 개발자 도구 - 삭제 시 아래 2줄 제거
import { DevTools } from './dev/DevTools';
const SHOW_DEV_TOOLS = true;

function App() {
  return (
    <>
      <BattleScreen />
      <SettingsModal />
      {/* [DEV] 개발자 도구 - 삭제 시 아래 1줄 제거 */}
      {SHOW_DEV_TOOLS && <DevTools />}
    </>
  );
}

export default App
