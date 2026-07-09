interface TextEditorProps {
  value: string
  seed: string
  onChange(value: string): void
  onSeedChange(value: string): void
  onClear(): void
}

export function TextEditor({
  value,
  seed,
  onChange,
  onSeedChange,
  onClear,
}: TextEditorProps) {
  return (
    <section className="panel editor-panel" aria-labelledby="input-title">
      <div className="section-heading">
        <div>
          <span className="section-number">01</span>
          <h2 id="input-title">输入原文</h2>
        </div>
        <button className="text-button" type="button" onClick={onClear} disabled={!value && !seed}>
          清空
        </button>
      </div>
      <label className="sr-only" htmlFor="source-text">
        输入需要处理的文字
      </label>
      <textarea
        id="source-text"
        className="source-textarea"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="在这里粘贴文字。内容不会离开当前浏览器。"
        spellCheck={false}
      />
      <div className="editor-meta">
        <label htmlFor="random-seed">随机种子</label>
        <input
          id="random-seed"
          value={seed}
          onChange={(event) => onSeedChange(event.target.value)}
          placeholder="留空也可以"
        />
        <span>{value.length.toLocaleString('zh-CN')} 字符</span>
      </div>
    </section>
  )
}
