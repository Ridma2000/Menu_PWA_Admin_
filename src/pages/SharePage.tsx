import { Copy, Download, ExternalLink, Share2 } from 'lucide-react'
import QRCode from 'qrcode'
import { useEffect, useMemo, useState } from 'react'
import { Button } from '../components/Button'
import { useAdminData } from '../hooks/useAdminData'

const copyToClipboard = async (value: string) => {
  if (navigator.clipboard) {
    await navigator.clipboard.writeText(value)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = value
  textarea.setAttribute('readonly', '')
  textarea.style.position = 'fixed'
  textarea.style.opacity = '0'
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand('copy')
  document.body.removeChild(textarea)
}

const createFileName = (name: string) =>
  `${name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || 'menu'}-qr.png`

export function SharePage() {
  const { settings } = useAdminData()
  const menuUrl = settings.menuUrl.trim()
  const [copyState, setCopyState] = useState<'idle' | 'copied'>('idle')
  const [qrDataUrl, setQrDataUrl] = useState('')

  const steps = useMemo(
    () => ['Download or copy the link', 'Print on table cards or stickers', 'Guests scan and browse instantly'],
    [],
  )

  useEffect(() => {
    let isMounted = true

    if (!menuUrl) {
      setQrDataUrl('')
      return
    }

    QRCode.toDataURL(menuUrl, {
      color: {
        dark: '#0f172a',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'M',
      margin: 2,
      width: 420,
    }).then((dataUrl) => {
      if (isMounted) {
        setQrDataUrl(dataUrl)
      }
    })

    return () => {
      isMounted = false
    }
  }, [menuUrl])

  const handleCopy = async () => {
    if (!menuUrl) {
      return
    }

    await copyToClipboard(menuUrl)
    setCopyState('copied')
    window.setTimeout(() => setCopyState('idle'), 1800)
  }

  const handleDownload = () => {
    if (!qrDataUrl) {
      return
    }

    const link = document.createElement('a')
    link.download = createFileName(settings.restaurantName)
    link.href = qrDataUrl
    link.click()
  }

  const handleShare = async () => {
    if (!menuUrl) {
      return
    }

    if (navigator.share) {
      await navigator.share({
        title: settings.restaurantName,
        text: `View the menu for ${settings.restaurantName}`,
        url: menuUrl,
      })
      return
    }

    await handleCopy()
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-950 dark:text-white">Share Menu</h2>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Create a guest-facing QR code and link for the live menu.</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)]">
        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-80 w-full max-w-80 items-center justify-center rounded-md bg-white p-4">
              {qrDataUrl ? (
                <img alt="Menu QR code" className="h-full w-full object-contain" src={qrDataUrl} />
              ) : (
                <p className="text-sm text-slate-500">Add a menu link in Settings.</p>
              )}
            </div>
            <p className="mt-4 text-sm font-medium text-slate-600 dark:text-slate-300">Scan to view menu</p>
            <p className="mt-2 max-w-full break-all font-mono text-xs text-slate-700 dark:text-slate-300">{menuUrl}</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button disabled={!qrDataUrl} icon={<Download size={17} />} onClick={handleDownload}>
                Download PNG
              </Button>
              <Button disabled={!menuUrl} icon={<Copy size={17} />} onClick={handleCopy} variant="secondary">
                {copyState === 'copied' ? 'Copied' : 'Copy Link'}
              </Button>
              <Button disabled={!menuUrl} icon={<Share2 size={17} />} onClick={handleShare} variant="secondary">
                Share Link
              </Button>
            </div>
          </div>
        </section>

        <section className="rounded-lg border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-950">
          <h3 className="text-lg font-semibold text-slate-950 dark:text-white">Share with guests</h3>
          <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
            Print the QR for tabletops, windows, or business cards. The link stays the same when you update menu
            details.
          </p>

          <div className="mt-6 space-y-4">
            {steps.map((step, index) => (
              <div className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200" key={step}>
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
                  {index + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-md border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500 dark:text-slate-400">Guest menu link</p>
            <p className="mt-2 break-all font-mono text-sm text-slate-800 dark:text-slate-200">{menuUrl}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button disabled={!menuUrl} icon={<Copy size={16} />} onClick={handleCopy} size="sm" variant="secondary">
                Copy
              </Button>
              <Button
                disabled={!menuUrl}
                icon={<ExternalLink size={16} />}
                onClick={() => window.open(menuUrl, '_blank', 'noopener,noreferrer')}
                size="sm"
                variant="secondary"
              >
                Open
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
