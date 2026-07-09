import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import App from './App'

describe('App text workflow', () => {
  beforeEach(() => {
    Object.assign(navigator, {
      clipboard: { writeText: vi.fn().mockResolvedValue(undefined) },
    })
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
})
