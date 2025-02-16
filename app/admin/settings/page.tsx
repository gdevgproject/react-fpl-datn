'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ErrorMessage } from '@/components/ui/error-message'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Textarea } from '@/components/ui/textarea'
import { fetchSettings, updateSettings } from '@/lib/mockData'
import { useEffect, useState } from 'react'

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    general: {
      siteName: '',
      siteUrl: '',
      adminEmail: ''
    },
    emailTemplates: {
      welcome: '',
      orderConfirmation: '',
      passwordReset: ''
    }
  })

  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSettings = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const fetchedSettings = await fetchSettings()
        setSettings(fetchedSettings)
      } catch (err) {
        setError('Failed to fetch settings. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    loadSettings()
  }, [])

  const handleGeneralSettingsChange = (key: string, value: string) => {
    setSettings({
      ...settings,
      general: { ...settings.general, [key]: value }
    })
  }

  const handleEmailTemplateChange = (key: string, value: string) => {
    setSettings({
      ...settings,
      emailTemplates: { ...settings.emailTemplates, [key]: value }
    })
  }

  const handleSaveSettings = async () => {
    setIsSaving(true)
    setError(null)
    try {
      await updateSettings(settings)
      // Settings saved successfully
    } catch (err) {
      setError('Failed to save settings. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) return <LoadingSpinner />

  return (
    <div>
      <h2 className='text-2xl font-bold mb-6'>Settings</h2>
      {error && <ErrorMessage message={error} />}
      <Tabs defaultValue='general'>
        <TabsList>
          <TabsTrigger value='general'>General Settings</TabsTrigger>
          <TabsTrigger value='email'>Email Templates</TabsTrigger>
        </TabsList>
        <TabsContent value='general'>
          <Card>
            <CardHeader>
              <CardTitle>General Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <form className='space-y-4'>
                <div>
                  <Label htmlFor='siteName'>Site Name</Label>
                  <Input
                    id='siteName'
                    value={settings.general.siteName}
                    onChange={(e) =>
                      handleGeneralSettingsChange('siteName', e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor='siteUrl'>Site URL</Label>
                  <Input
                    id='siteUrl'
                    value={settings.general.siteUrl}
                    onChange={(e) =>
                      handleGeneralSettingsChange('siteUrl', e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor='adminEmail'>Admin Email</Label>
                  <Input
                    id='adminEmail'
                    type='email'
                    value={settings.general.adminEmail}
                    onChange={(e) =>
                      handleGeneralSettingsChange('adminEmail', e.target.value)
                    }
                  />
                </div>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Settings'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value='email'>
          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <form className='space-y-4'>
                <div>
                  <Label htmlFor='welcomeEmail'>Welcome Email</Label>
                  <Textarea
                    id='welcomeEmail'
                    value={settings.emailTemplates.welcome}
                    onChange={(e) =>
                      handleEmailTemplateChange('welcome', e.target.value)
                    }
                  />
                </div>
                <div>
                  <Label htmlFor='orderConfirmation'>Order Confirmation</Label>
                  <Textarea
                    id='orderConfirmation'
                    value={settings.emailTemplates.orderConfirmation}
                    onChange={(e) =>
                      handleEmailTemplateChange(
                        'orderConfirmation',
                        e.target.value
                      )
                    }
                  />
                </div>
                <div>
                  <Label htmlFor='passwordReset'>Password Reset</Label>
                  <Textarea
                    id='passwordReset'
                    value={settings.emailTemplates.passwordReset}
                    onChange={(e) =>
                      handleEmailTemplateChange('passwordReset', e.target.value)
                    }
                  />
                </div>
                <Button onClick={handleSaveSettings} disabled={isSaving}>
                  {isSaving ? 'Saving...' : 'Save Templates'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
