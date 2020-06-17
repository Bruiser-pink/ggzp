
export function getRedirectTo(type,header) {
  let path = ''
  if(type === 'boss') {
    path = '/boss'
  }else {
    path = 'excellence'
  }
  if(!header) {
    path += 'info'
  }
  return path
}