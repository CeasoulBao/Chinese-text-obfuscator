import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App text workflow', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
  })

  it('opens text settings by default and switches tabs with keyboard', () => {
    render(<App />)
    const textTab = screen.getByRole('tab', { name: /文本混淆/ })
    const imageTab = screen.getByRole('tab', { name: /图片导出/ })
    expect(textTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: /文本混淆/ })).toBeVisible()

    fireEvent.keyDown(textTab, { key: 'ArrowRight' })
    expect(imageTab).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: /图片导出/ })).toBeVisible()
  })

  it('transforms entered text and can clear it', () => {
    render(<App />)
    const input = screen.getByLabelText('输入需要处理的文字')
    fireEvent.change(input, { target: { value: '黑龙江商户' } })
    expect(screen.getByLabelText('混淆后的文字')).not.toHaveValue('')
    fireEvent.click(screen.getByRole('button', { name: '清空' }))
    expect(input).toHaveValue('')
  })

  it('applies heavy mode and displays a readability warning', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /重度/ }))
    expect(screen.getByRole('alert')).toHaveTextContent('显著降低可读性')
  })

  it('allows modules to be disabled and moved', () => {
    render(<App />)
    fireEvent.click(screen.getByLabelText('启用词典替换'))
    expect(screen.getByLabelText('启用词典替换')).not.toBeChecked()
    fireEvent.click(screen.getByLabelText('词典替换下移'))
    const moduleHeadings = screen.getAllByRole('heading', { level: 3 })
    expect(moduleHeadings[0]).toHaveTextContent('同音形近')
  })

  it('edits dictionary rules', () => {
    render(<App />)
    const source = screen.getByLabelText('第 1 条原词')
    fireEvent.change(source, { target: { value: '新词' } })
    expect(source).toHaveValue('新词')
  })

  it('adds multiple replacement candidates to one source', () => {
    render(<App />)
    const addButtons = screen.getAllByRole('button', { name: '＋ 添加候选词' })
    fireEvent.click(addButtons[0])
    const candidate = screen.getByLabelText('第 1 条第 3 个候选词')
    fireEvent.change(candidate, { target: { value: '东北' } })
    expect(candidate).toHaveValue('东北')
  })

  it('imports and merges an offline dictionary pack', async () => {
    render(<App />)
    const file = new File(['placeholder'], 'community.json', {
      type: 'application/json',
    })
    Object.defineProperty(file, 'text', {
      value: () =>
        Promise.resolve(
          JSON.stringify({
            schemaVersion: 1,
            name: '社区测试',
            description: '',
            author: '网友',
            license: 'CC0-1.0',
            entries: [{ source: '新词', replacements: ['代称甲', '代称乙'] }],
          }),
        ),
    })
    fireEvent.change(screen.getByLabelText('导入 JSON 词典包'), {
      target: { files: [file] },
    })
    const mergeButton = await screen.findByRole('button', { name: '合并这个词典' })
    fireEvent.click(mergeButton)

    await waitFor(() => {
      expect(screen.getByDisplayValue('新词')).toBeInTheDocument()
      expect(screen.getByText(/新增 1 个原词/)).toBeInTheDocument()
    })
  })

  it('configures image overlays and enables export after input', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('tab', { name: /图片导出/ }))
    expect(screen.getByRole('button', { name: '自动切图导出' })).toBeDisabled()
    fireEvent.change(screen.getByLabelText('输入需要处理的文字'), {
      target: { value: '图片测试' },
    })
    expect(screen.getByRole('button', { name: '自动切图导出' })).toBeEnabled()
    fireEvent.click(screen.getByLabelText('纵向穿列线'))
    expect(screen.getByLabelText('纵向穿列线')).toBeChecked()
    fireEvent.change(screen.getByLabelText('图片字号'), { target: { value: '44' } })
    expect(screen.getByLabelText('图片字号')).toHaveValue(44)
  })
})
