function formatConversation(message) {
  return message.map ((message, i) => {
    if (i % 2 === 0){
      return `Human: ${message}`
    } else {
        return `AI: ${message}`
    }
  }).join('\n')
}

export { formatConversation }
