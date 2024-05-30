import { useState, useEffect, useMemo } from "react"
import { db } from "../data/db"
import { CartItem, Guitar } from "../types"

export function useCart() {
    const MIN_ITEMS = 1

    const initialCart = () : CartItem[] => {
        const localStorageCart = localStorage.getItem('guitarLa')
        return localStorageCart ? JSON.parse(localStorageCart) : []
      }

      const initialData : Guitar[] = []
    
      const [data, setData] = useState(initialData)
      const [cart, setCart] = useState(initialCart)
      
      useEffect(() => {
        setData(db)
      }, [])
    
      useEffect(() => {
        saveLocalStorage()
      }, [cart])
    
      function addCart(item : Guitar) {
        const itemExist = cart.findIndex(guitar => guitar.id === item.id)
        if (itemExist >= 0) {
          const updatedCart = [...cart]
          updatedCart[itemExist].quantity++
          setCart(updatedCart)
        } else {
          const newItem : CartItem = {...item, quantity: 1}
          setCart([...cart, newItem])
        }
      }
    
      function removeFromCart(id : Guitar['id']) {
        setCart(prevCart => prevCart.filter(guitar => guitar.id !== id))
      }
    
      function increaseQuantity(id : Guitar['id'])
      {
        const updatedCart = cart.map(item => {
          if (item.id === id) {
            item.quantity++
          }
          return item
        })
        setCart(updatedCart)
      }
    
      function decreaseQuantity(id : Guitar['id']) {
        const updateCart = cart.map(item => {
          if (item.id === id && item.quantity > MIN_ITEMS) {
            item.quantity--
          }
          return item
        })
        setCart(updateCart)
      }
    
      function clearCart(){
        setCart([])
      }
    
      function saveLocalStorage() {
        localStorage.setItem('guitarLa', JSON.stringify(cart))
      }

      const cartTotal = useMemo(() => cart.reduce((total, item) => total + (item.quantity * item.price), 0), [cart]) 

      return {
        data,
        cart,
        addCart,
        removeFromCart,
        decreaseQuantity,
        increaseQuantity,
        clearCart,
        cartTotal
      }

}