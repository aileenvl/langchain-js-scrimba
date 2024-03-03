import { RecursiveCharacterTextSplitter } from 'langchain/text_splitter'

import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'
import { Embeddings } from 'langchain/dist/embeddings/base'

try {
  const result = await fetch('scrimba-info.txt')
  const text = await result.text();
  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    separators: ['\n\n', '\n', ' ', ''], // default setting
    chunkOverlap: 50
  })

  const embeddings = new OpenAIEmbeddings({ openAIApiKey: import.meta.env.VITE_OPENAI_API_KEY })
  const output = await splitter.createDocuments([text])
  const sbApiKey = import.meta.env.VITE_SUPABASE_API_KEY
  const sbUrl = import.meta.env.VITE_SUPABASE_URL_LC_CHATBOT
  const openAIApiKey = import.meta.env.VITE_OPENAI_API_KEY

  const client = createClient(sbUrl, sbApiKey);
  const vectorStore = new SupabaseVectorStore(embeddings, {
    client,
    tableName: 'documents',
    queryName: 'match_documents'
  })

  const retriever = vectorStore.asRetriever()

  await SupabaseVectorStore.fromDocuments(
    output,
    new OpenAIEmbeddings({ openAIApiKey }),
    {
      client,
      tableName: 'documents',
    }
  )

  console.log(output)
} catch (err) {
  console.log(err)
}

document.addEventListener('submit', (e) => {
  e.preventDefault()
  progressConversation()
})


async function progressConversation() {
  const userInput = document.getElementById('user-input')
  const chatbotConversation = document.getElementById('chatbot-conversation-container')
  const question = userInput.value
  userInput.value = ''

  // add human message
  const newHumanSpeechBubble = document.createElement('div')
  newHumanSpeechBubble.classList.add('speech', 'speech-human')
  chatbotConversation.appendChild(newHumanSpeechBubble)
  newHumanSpeechBubble.textContent = question
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight

  // add AI message
  const newAiSpeechBubble = document.createElement('div')
  newAiSpeechBubble.classList.add('speech', 'speech-ai')
  chatbotConversation.appendChild(newAiSpeechBubble)
  newAiSpeechBubble.textContent = result
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight
}