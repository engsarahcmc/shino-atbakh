import { useCallback, useEffect, useMemo, useState } from "react"
import { AuthContext } from "./context"
import * as api from "../services/api"

const TOKEN_KEY = "token"
const USER_KEY = "shno-user"

const read = (key) => {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

const readUser = () => {
  try {
    return JSON.parse(read(USER_KEY) || "null")
  } catch {
    return null
  }
}

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => read(TOKEN_KEY))
  const [user, setUser] = useState(readUser)

  const save = (nextToken, nextUser) => {
    setToken(nextToken)
    setUser(nextUser)
    try {
      if (nextToken) localStorage.setItem(TOKEN_KEY, nextToken)
      else localStorage.removeItem(TOKEN_KEY)
      if (nextUser) localStorage.setItem(USER_KEY, JSON.stringify(nextUser))
      else localStorage.removeItem(USER_KEY)
    } catch {
      /* التخزين مو متاح */
    }
  }

  const logout = useCallback(() => save(null, null), [])

  // نحدّث بيانات المستخدم من السيرفر عند فتح الموقع (مثلاً إذا المدير غيّر صلاحيته)
  useEffect(() => {
    if (!token) return
    api
      .getProfile()
      .then((data) => {
        setUser(data.user)
        try {
          localStorage.setItem(USER_KEY, JSON.stringify(data.user))
        } catch {
          /* تجاهل */
        }
      })
      .catch((error) => {
        if (error.status === 401 || error.status === 404) logout()
      })
  }, [token, logout])

  const value = useMemo(
    () => ({
      user,
      token,
      isLoggedIn: Boolean(token && user),
      isAdmin: Boolean(user?.is_admin),
      isPremium: Boolean(user?.is_premium),
      login: async (email, password) => {
        const data = await api.login({ email, password })
        save(data.token, data.user)
        return data.user
      },
      register: async (name, email, password) => {
        await api.register({ name, email, password })
        const data = await api.login({ email, password })
        save(data.token, data.user)
        return data.user
      },
      updateUser: (next) => save(token, next),
      // يجيب بيانات المستخدم من جديد (مثلاً بعد الاشتراك أو الإلغاء)
      refreshUser: async () => {
        const data = await api.getProfile()
        save(token, data.user)
        return data.user
      },
      logout,
    }),
    [user, token, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
