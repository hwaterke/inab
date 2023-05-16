import {useOutletContext} from 'react-router-dom'
import {useEffect} from 'react'

type ContextType = {setTitle: (title: string) => void}

export function useTitle(title: string) {
  const {setTitle} = useOutletContext<ContextType>()

  useEffect(() => {
    setTitle(title)
  }, [setTitle, title])
}
