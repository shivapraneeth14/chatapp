import { configureStore } from '@reduxjs/toolkit'
import { Userreducer } from './UserSlice'

export const store = configureStore({
    reducer: {
        user: Userreducer 
      }
})