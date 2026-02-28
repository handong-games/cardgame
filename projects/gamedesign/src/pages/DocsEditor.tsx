import { useEffect, useState } from 'react'
import { useDocStore } from '../store/useDocStore'
import MarkdownEditor from '../components/editor/MarkdownEditor'
import type { DocTreeNode } from '../lib/api'

function TreeItem({
  node,
  onSelect,
  selectedPath,
  expandedPaths,
  onToggleExpand,
  depth = 0,
}: {
  node: DocTreeNode
  onSelect: (path: string) => void
  selectedPath: string | null
  expandedPaths: Set<string>
  onToggleExpand: (path: string) => void
  depth?: number
}) {
  const isExpanded = expandedPaths.has(node.path)
  const isSelected = selectedPath === node.path

  if (node.type === 'directory') {
    return (
      <div>
        <button
          onClick={() => onToggleExpand(node.path)}
          className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm hover:bg-slate-700 rounded transition-colors`}
          style={{ paddingLeft: `${depth * 16 + 12}px` }}
        >
          <span className="text-slate-400">{isExpanded ? '📂' : '📁'}</span>
          <span className="text-slate-300">{node.name}</span>
        </button>
        {isExpanded && node.children && (
          <div>
            {node.children.map((child) => (
              <TreeItem
                key={child.path}
                node={child}
                onSelect={onSelect}
                selectedPath={selectedPath}
                expandedPaths={expandedPaths}
                onToggleExpand={onToggleExpand}
                depth={depth + 1}
              />
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <button
      onClick={() => onSelect(node.path)}
      className={`w-full flex items-center gap-2 px-3 py-2 text-left text-sm rounded transition-colors ${
        isSelected
          ? 'bg-emerald-600 text-white'
          : 'hover:bg-slate-700 text-slate-300'
      }`}
      style={{ paddingLeft: `${depth * 16 + 12}px` }}
    >
      <span className="text-slate-400">📄</span>
      <span className="truncate">{node.name}</span>
    </button>
  )
}

export default function DocsEditor() {
  const [selectedDocPath, setSelectedDocPath] = useState<string | null>(null)
  const {
    tree,
    currentDoc,
    isLoading,
    error,
    isDirty,
    editedContent,
    expandedPaths,
    loadTree,
    loadDoc,
    setEditedContent,
    save,
    resetChanges,
    toggleExpanded,
  } = useDocStore()

  useEffect(() => {
    loadTree()
  }, [loadTree])

  useEffect(() => {
    if (selectedDocPath) {
      loadDoc(selectedDocPath)
    }
  }, [selectedDocPath, loadDoc])

  const handleSelectDoc = (path: string) => {
    setSelectedDocPath(path)
  }

  const handleSave = async () => {
    await save()
  }

  return (
    <div className="h-full flex gap-4">
      {/* 문서 트리 */}
      <div className="w-72 bg-slate-800 rounded-lg border border-slate-700 overflow-hidden flex flex-col">
        <div className="p-3 border-b border-slate-700">
          <h4 className="font-medium text-sm">디자인 문서</h4>
          <p className="text-xs text-slate-400 mt-1">docs/</p>
        </div>
        <div className="flex-1 overflow-auto p-2">
          {isLoading && tree.length === 0 ? (
            <p className="text-sm text-slate-400 p-3">로딩 중...</p>
          ) : (
            tree.map((node) => (
              <TreeItem
                key={node.path}
                node={node}
                onSelect={handleSelectDoc}
                selectedPath={currentDoc?.path || null}
                expandedPaths={expandedPaths}
                onToggleExpand={toggleExpanded}
              />
            ))
          )}
        </div>
      </div>

      {/* 에디터 영역 */}
      <div className="flex-1 flex flex-col min-w-0">
        {currentDoc ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3 min-w-0">
                <h3 className="text-lg font-medium truncate">
                  {currentDoc.path.split('/').pop()}
                  {isDirty && <span className="text-amber-400 ml-2">*</span>}
                </h3>
                <span className="text-sm text-slate-500 truncate">
                  {currentDoc.path}
                </span>
              </div>

              <div className="flex items-center gap-3 flex-shrink-0">
                {isDirty && (
                  <button
                    onClick={resetChanges}
                    className="px-4 py-2 text-sm bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                  >
                    변경 취소
                  </button>
                )}
                <button
                  onClick={handleSave}
                  disabled={!isDirty || isLoading}
                  className={`px-4 py-2 text-sm rounded-lg transition-colors ${
                    isDirty && !isLoading
                      ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                      : 'bg-slate-700 text-slate-500 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? '저장 중...' : '저장'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-lg mb-4">
                {error}
              </div>
            )}

            <div className="flex-1 min-h-0">
              <MarkdownEditor
                value={editedContent}
                onChange={setEditedContent}
                height={window.innerHeight - 220}
              />
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-slate-400">
            <div className="text-center">
              <p className="text-lg mb-2">문서를 선택하세요</p>
              <p className="text-sm">왼쪽 트리에서 편집할 문서를 선택합니다</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
