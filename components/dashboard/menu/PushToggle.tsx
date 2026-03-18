'use client'

import { useState, useEffect } from 'react'
import { Bell, BellOff, Loader2 } from 'lucide-react'
import { getSubscriptionState, toggleStaffPushSubscription } from './actions'
import { sileo } from 'sileo'
import { usePWA } from '@/hooks/usePWA'

function urlBase64ToUint8Array(base64String: string) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
}

// Añadimos una prop opcional para recibir la función que abre el modal de Apple
interface PushToggleProps {
    onRequireInstall?: () => void;
}

export function PushToggle({ onRequireInstall }: PushToggleProps) {
    const { isIOS, isStandalone } = usePWA() // Traemos la info del dispositivo
    const [isSubscribed, setIsSubscribed] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [isSupported, setIsSupported] = useState<boolean>(true)
    const [isMounted, setIsMounted] = useState<boolean>(false)

    useEffect(() => {
        setIsMounted(true)

        const checkSubscription = async () => {
            if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
                setIsSupported(false)
                setIsLoading(false)
                return
            }

            try {
                const registration = await navigator.serviceWorker.ready
                const subscription = await registration.pushManager.getSubscription()
                
                if (subscription) {
                    const response = await getSubscriptionState(subscription.toJSON())

                    if (response.error) {
                        sileo.error({
                            title: response.error
                        })
                    } else if (response.success) {
                        setIsSubscribed(response.isActive)
                    } else {
                        setIsSubscribed(false)
                    }
                }
            } catch (error) {
                console.error('Error comprobando suscripción: ', error)
            } finally {
                setIsLoading(false)
            }
        }
        checkSubscription()
    }, [])

    const handleToggle = async () => {
        // 🔴 INTERVENCIÓN PARA IOS: Si está en iPhone pero no en la App instalada, pedimos instalar
        if (isIOS && !isStandalone) {
            if (onRequireInstall) {
                onRequireInstall()
            } else {
                sileo.error({ title: 'Instala la app para recibir notificaciones' })
            }
            return
        }

        setIsLoading(true)

        try {
            const registration = await navigator.serviceWorker.ready

            if (isSubscribed) {
                const subscription = await registration.pushManager.getSubscription()

                if (subscription) {
                    const response = await toggleStaffPushSubscription(subscription.toJSON(), false)
                    if (response.error) {
                        sileo.error({
                            title: 'Error',
                            description: response.error
                        })
                        return
                    }
                    setIsSubscribed(false)
                }
            } else {
                let subscription = await registration.pushManager.getSubscription()

                if (!subscription) {
                    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
                    if (!vapidPublicKey) {
                        sileo.error({ title: 'Error interno' })
                        return
                    }
                    subscription = await registration.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey)
                    })
                }

                const response = await toggleStaffPushSubscription(subscription.toJSON(), true)
                if (response.error) {
                    sileo.error({
                        title: 'Error activando las notificaciones'
                    })
                    return
                }
                setIsSubscribed(true)
            }
        } catch (error) {
            console.error('Error: ', error)
            sileo.error({
                title: 'Error',
                description: 'No se pudo cambiar el estado de las notificaciones'
            })
        } finally {
            setIsLoading(false)
        }
    }

    // ARREGLO VISUAL: Ocultamos el botón si no está soportado... 
    // EXCEPTO si es iOS no instalado (en ese caso lo mostramos para que al clicar salga el aviso)
    if (isMounted && !isSupported && !(isIOS && !isStandalone)) {
        return null
    }

    return (
        <button
            onClick={handleToggle}
            disabled={isLoading && !(isIOS && !isStandalone)}
            className={`group flex w-full items-center justify-between px-4 py-2 rounded-2xl lg:rounded-xl text-sm font-medium border transition-all duration-200 cursor-pointer disabled:opacity-50 ${isSubscribed
                    ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20 hover:bg-yellow-500/20'
                    : 'bg-zinc-900/50 text-zinc-400 border-white/5 hover:bg-zinc-800 hover:text-zinc-300'
                }`}
        >
            <div className="flex items-center gap-3">
                {isLoading && !(isIOS && !isStandalone) ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                ) : isSubscribed ? (
                    <Bell className="w-5 h-5" />
                ) : (
                    <BellOff className="w-5 h-5" />
                )}
                <span className='hidden md:block font-unbounded font-normal text-xs'>Notificaciones</span>
            </div>

            <div
                className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors duration-300 ${isSubscribed ? 'bg-yellow-500' : 'bg-zinc-700'
                    }`}
            >
                <span
                    className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform duration-300 ${isSubscribed ? 'translate-x-5' : 'translate-x-1'
                        }`}
                />
            </div>
        </button>
    )
}