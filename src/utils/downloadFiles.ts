const downloadFile = (data: string, fileName: string, type: string) => {
  const blob = new Blob([data], { type })

  const link = document.createElement('a')

  link.href = URL.createObjectURL(blob)
  link.download = fileName

  document.body.appendChild(link)

  link.click()

  link.remove()

  URL.revokeObjectURL(link.href)
}

export default downloadFile
