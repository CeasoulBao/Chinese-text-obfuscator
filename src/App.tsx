import { useMemo, useReducer, useState } from 'react'
import { Notice } from './components/Notice'
import { OutputPanel } from './components/OutputPanel'
import { PipelineEditor } from './components/PipelineEditor'
import { PresetSelector } from './components/PresetSelector'
import { TextEditor } from './components/TextEditor'
import { runPipeline } from './obfuscation/pipeline'
import { transformRegistry } from './obfuscation/registry'
import { appReducer, createInitialState } from './state/appState'

export default function App() {
  const [state, dispatch] = useReducer(appReducer, undefined, createInitialState)
  const [copyStatus, setCopyStatus] = useState('')

  const result = useMemo(() => {
    const items = state.pipeline.flatMap((item) => {
      const registration = transformRegistry.find((entry) => entry.module.id === item.id)
      return registration
        ? [
            {
              module: registration.module,
              enabled: item.enabled,
              intensity: item.intensity,
              config: item.config,
            },
          ]
        : []
    })
    return runPipeline(state.sourceText, items, state.seed || '字隙-default')
  }, [state.pipeline, state.seed, state.sourceText])

  const copyResult = async () => {
    try {
      await navigator.clipboard.writeText(result.text)
      setCopyStatus('已复制到剪贴板')
    } catch {
      setCopyStatus('复制失败，请手动选择文字')
    }
  }

  const showReadabilityWarning =
    state.preset === 'heavy' ||
    state.pipeline.filter((item) => item.enabled).some((item) => item.intensity >= 0.6)

  return (
    <main className="app-shell">
      <header className="masthead">
        <p className="eyebrow">LOCAL TEXT WORKBENCH · 本地文字工作台</p>
        <h1>字隙</h1>
        <p className="lede">
          可组合的文字混淆与图片排版工具。原文只在当前浏览器内处理，不上传、不留存。
        </p>
      </header>
      <Notice>
        这是文本混淆工具，不是加密工具。任何设置都不能保证避开 AI、OCR、内容审核或账号限制。
      </Notice>
      <div className="workspace-grid">
        <TextEditor
          value={state.sourceText}
          seed={state.seed}
          onChange={(value) => dispatch({ type: 'set-source', value })}
          onSeedChange={(value) => dispatch({ type: 'set-seed', value })}
          onClear={() => dispatch({ type: 'clear-content' })}
        />
        <section className="panel pipeline-panel" aria-labelledby="pipeline-title">
          <div className="section-heading">
            <div>
              <span className="section-number">02</span>
              <h2 id="pipeline-title">组合流水线</h2>
            </div>
            <span className="flow-mark">上 → 下</span>
          </div>
          <PresetSelector
            value={state.preset}
            onChange={(preset) => dispatch({ type: 'apply-preset', preset })}
          />
          {showReadabilityWarning && (
            <Notice tone="warning">当前组合可能显著降低可读性，请在发送前核对结果。</Notice>
          )}
          <PipelineEditor
            items={state.pipeline}
            onToggle={(id) => dispatch({ type: 'toggle-module', id })}
            onIntensity={(id, intensity) =>
              dispatch({ type: 'set-intensity', id, intensity })
            }
            onMove={(id, direction) => dispatch({ type: 'move-module', id, direction })}
            onConfig={(id, config) => dispatch({ type: 'set-config', id, config })}
          />
        </section>
        <OutputPanel value={result.text} status={copyStatus} onCopy={copyResult} />
      </div>
    </main>
  )
}
