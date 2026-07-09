interface OutputPanelProps {
  value: string
  status: string
  onCopy(): void
}

export function OutputPanel({ value, status, onCopy }: OutputPanelProps) {
  return (
    <section className="panel output-panel" aria-labelledby="output-title">
      <div className="section-heading">
        <div>
          <span className="section-number">03</span>
          <h2 id="output-title">混淆结果</h2>
        </div>
        <button className="primary-button" type="button" onClick={onCopy} disabled={!value}>
          复制结果
        </button>
      </div>
      <label className="sr-only" htmlFor="output-text">
        混淆后的文字
      </label>
      <textarea id="output-text" className="output-textarea" value={value} readOnly />
      <div className="output-meta">
        <span>{value.length.toLocaleString('zh-CN')} 字符</span>
        <span aria-live="polite">{status}</span>
      </div>
    </section>
  )
}
