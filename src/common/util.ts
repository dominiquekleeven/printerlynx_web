// util module

export function bytes_to_size(bytes: number) {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
  if (bytes === 0) return '0 Byte'
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return parseFloat((bytes / Math.pow(1024, i)).toFixed(2)) + ' ' + sizes[i]
}

export function epoch_to_date(epoch: number) {
  const date = new Date(epoch * 1000)
  return date.toDateString()
}