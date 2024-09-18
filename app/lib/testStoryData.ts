import { getStoryData } from './storyData'

async function testGetStoryData() {
  console.log('Testando getStoryData...')
  try {
    const result = await getStoryData('test-id')
    console.log('Resultado:', result)
  } catch (error) {
    console.error('Erro ao chamar getStoryData:', error)
  }
}

testGetStoryData()