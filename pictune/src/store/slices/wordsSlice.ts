// store/slices/wordsSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit"

export interface Word {
  text: string
  start: number
  end: number
}

interface WordsState {
  words: Word[]
}

const initialState: WordsState = {
  words: []
}

const wordsSlice = createSlice({
  name: "words",
  initialState,
  reducers: {
    setWords(state, action: PayloadAction<Word[]>) {
      state.words = action.payload
    },
    addWord(state) {
      const last = state.words[state.words.length - 1]
      const start = last ? last.end + 0.1 : 0
      const end = start + 0.4
      state.words.push({ text: "New", start, end })
    },
    removeWord(state, action: PayloadAction<number>) {
      state.words.splice(action.payload, 1)
    },
    updateWordText(state, action: PayloadAction<{ index: number; text: string }>) {
      state.words[action.payload.index].text = action.payload.text
    },
    updateWordTime(state, action: PayloadAction<{ index: number; field: "start" | "end"; value: number }>) {
      state.words[action.payload.index][action.payload.field] = action.payload.value
    }
  }
})

export const {
  setWords,
  addWord,
  removeWord,
  updateWordText,
  updateWordTime
} = wordsSlice.actions

export default wordsSlice.reducer
