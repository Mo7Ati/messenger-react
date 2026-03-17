import { useRef, useState, useMemo } from "react"
import { useAuth } from "@/features/auth/auth-context"
import { profileService } from "@/services/profile-service"
import { getErrorMessage } from "@/lib/api-error"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Camera, Loader2 } from "lucide-react"
import { useNavigate } from "react-router"

type ProfileFormData = {
    username: string
    bio: string
    email: string
}

type PasswordFormData = {
    current_password: string
    password: string
    password_confirmation: string
}

const initialPasswordData: PasswordFormData = {
    current_password: "",
    password: "",
    password_confirmation: "",
}

export default function Profile() {
    const navigate = useNavigate()
    const { user, setUser } = useAuth()

    const fileInputRef = useRef<HTMLInputElement>(null)
    const [avatarFile, setAvatarFile] = useState<File | null>(null)
    const [profileLoading, setProfileLoading] = useState(false)
    const [passwordLoading, setPasswordLoading] = useState(false)

    const [profileData, setProfileData] = useState<ProfileFormData>({
        username: user?.username ?? "",
        bio: user?.bio ?? "",
        email: user?.email ?? "",
    })

    const [passwordData, setPasswordData] = useState<PasswordFormData>(initialPasswordData)

    const avatarPreview = useMemo(() => {
        if (avatarFile) return URL.createObjectURL(avatarFile)
        return user?.avatar_url
    }, [avatarFile, user?.avatar_url])

    if (!user) return null

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) setAvatarFile(file)
        e.target.value = ""
    }

    const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setProfileLoading(true)
        try {
            const formData = new FormData()
            formData.append("username", profileData.username)
            formData.append("bio", profileData.bio)
            formData.append("email", profileData.email)
            if (avatarFile) {
                formData.append("avatar", avatarFile)
            }
            const updatedUser = await profileService.updateProfile(formData)
            setUser(updatedUser)
            setAvatarFile(null)
            toast.success("Profile updated successfully")
        } catch (err: unknown) {
            toast.error(getErrorMessage(err, "Failed to update profile"))
        } finally {
            setProfileLoading(false)
        }
    }

    const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setPasswordLoading(true)
        try {
            await profileService.updatePassword(passwordData)
            setPasswordData(initialPasswordData)
            toast.success("Password updated successfully")
        } catch (err: unknown) {
            toast.error(getErrorMessage(err, "Failed to update password"))
        } finally {
            setPasswordLoading(false)
        }
    }

    return (
        <div className="flex h-full flex-col">
            <div className="flex items-center gap-3 border-b bg-background px-4 py-3">
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => navigate("/chats")}
                >
                    <ArrowLeft className="h-5 w-5" />
                </Button>
                <h1 className="text-lg font-semibold">Account Settings</h1>
            </div>

            <div className="flex flex-1 items-start justify-center bg-background p-6">
                <Tabs defaultValue="profile" className="w-full max-w-lg">
                    <TabsList className="w-full">
                        <TabsTrigger value="profile">Profile</TabsTrigger>
                        <TabsTrigger value="password">Password</TabsTrigger>
                    </TabsList>

                    <TabsContent value="profile">
                        <form onSubmit={handleProfileSubmit} className="pt-4">
                            <FieldGroup>
                                <div className="flex justify-center">
                                    <button
                                        type="button"
                                        className="group relative"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <Avatar className="h-20 w-20">
                                            <AvatarImage src={avatarPreview} alt={user.username} />
                                            <AvatarFallback className="text-xl">
                                                {user.username.slice(0, 2).toUpperCase()}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                                            <Camera className="h-5 w-5 text-white" />
                                        </div>
                                    </button>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                </div>

                                <Field>
                                    <FieldLabel htmlFor="username">Username</FieldLabel>
                                    <Input
                                        id="username"
                                        value={profileData.username}
                                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                        required
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="bio">Bio</FieldLabel>
                                    <Textarea
                                        id="bio"
                                        value={profileData.bio}
                                        onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                                        placeholder="Tell something about yourself..."
                                        rows={2}
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="email">Email</FieldLabel>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        required
                                    />
                                </Field>

                                <Field>
                                    <Button type="submit" disabled={profileLoading}>
                                        {profileLoading ? <Loader2 className="animate-spin" /> : "Save Changes"}
                                    </Button>
                                </Field>
                            </FieldGroup>
                        </form>
                    </TabsContent>

                    <TabsContent value="password">
                        <form onSubmit={handlePasswordSubmit} className="pt-4">
                            <FieldGroup>
                                <Field>
                                    <FieldLabel htmlFor="current_password">Current Password</FieldLabel>
                                    <Input
                                        id="current_password"
                                        type="password"
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData({ ...passwordData, current_password: e.target.value })}
                                        required
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="password">New Password</FieldLabel>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={passwordData.password}
                                        onChange={(e) => setPasswordData({ ...passwordData, password: e.target.value })}
                                        required
                                    />
                                </Field>

                                <Field>
                                    <FieldLabel htmlFor="password_confirmation">Confirm New Password</FieldLabel>
                                    <Input
                                        id="password_confirmation"
                                        type="password"
                                        value={passwordData.password_confirmation}
                                        onChange={(e) => setPasswordData({ ...passwordData, password_confirmation: e.target.value })}
                                        required
                                    />
                                </Field>

                                <Field>
                                    <Button type="submit" disabled={passwordLoading}>
                                        {passwordLoading ? <Loader2 className="animate-spin" /> : "Update Password"}
                                    </Button>
                                </Field>
                            </FieldGroup>
                        </form>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}
