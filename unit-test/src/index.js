import Request from './utils'

const request = new Request()

export async function getTopics () {
  return request.fetch({
    method: 'GET',
    url: 'https://cnodejs.org/api/v1/topics'
  })
}

export function setDivContent () {
  const div = document.getElementById('test')
  div.innerHTML = 'hallo world'
}
