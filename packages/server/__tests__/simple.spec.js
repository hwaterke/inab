describe('Simple jest setup test', () => {
  it('should works', () => {
    expect(true).toBe(true)
  })

  it('should work with es6 syntax', () => {
    const a = {a: 42}
    expect({...a}).toEqual(a)
  })
})
