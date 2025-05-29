import { useContext } from 'react'
import { AuthContext } from '../AuthContextDefinition' // Update import path

export function useAuth() {
  return useContext(AuthContext)
}