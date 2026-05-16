"use client";
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { usersApi } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Save, User, Mail, Shield, Bell, Key, Camera } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function InstructorSettingsPage() {
  const queryClient = useQueryClient();
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [avatarPreview, setAvatarPreview] = useState("");

  const { data: profileRes, isLoading } = useQuery({
    queryKey: ["instructor-profile"],
    queryFn: () => usersApi.getProfile().then(r => r.data),
  });

  const profile = profileRes?.data;

  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setBio(profile.bio || "");
      setAvatarPreview(profile.image || "");
    }
  }, [profile]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => usersApi.updateProfile(data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["instructor-profile"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update profile");
    }
  });

  const handleSave = () => {
    updateMutation.mutate({ name, bio, image: avatarPreview });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10 max-w-5xl">
      <div>
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold tracking-tight"
        >
          Studio Settings
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
          className="text-muted-foreground text-sm mt-1"
        >
          Manage your instructor profile, payout methods, and notifications.
        </motion.p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-1 space-y-4">
          <Card className="border-border/50 bg-card/40 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="h-24 bg-gradient-to-r from-orange-400 to-rose-500 w-full"></div>
            <CardContent className="px-6 pb-6 pt-0 relative flex flex-col items-center text-center">
              <div className="relative -mt-12 mb-4">
                <Avatar className="h-24 w-24 border-4 border-background shadow-lg">
                  <AvatarImage src={avatarPreview} />
                  <AvatarFallback className="bg-muted text-muted-foreground text-xl">
                    {name?.[0] || <User />}
                  </AvatarFallback>
                </Avatar>
                <Button size="icon" className="absolute bottom-0 right-0 h-8 w-8 rounded-full shadow-sm bg-orange-600 hover:bg-orange-700 text-white">
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              <h3 className="font-bold text-lg">{profile?.name}</h3>
              <p className="text-xs text-orange-500 font-medium uppercase tracking-wider mb-4">{profile?.role}</p>
              <div className="w-full text-left space-y-3 pt-4 border-t border-border/50">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="h-4 w-4" />
                  <span className="truncate">{profile?.email}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Shield className="h-4 w-4" />
                  <span>Verified Instructor</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-sm">
              <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle>Public Profile</CardTitle>
                <CardDescription>This information is displayed publicly on your course pages.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Display Name</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      className="focus-visible:ring-orange-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="avatarUrl">Avatar URL</Label>
                    <Input 
                      id="avatarUrl" 
                      value={avatarPreview} 
                      onChange={e => setAvatarPreview(e.target.value)} 
                      placeholder="https://..."
                      className="focus-visible:ring-orange-500"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Instructor Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={bio} 
                    onChange={e => setBio(e.target.value)} 
                    placeholder="Tell students about your expertise and background..."
                    className="min-h-[120px] focus-visible:ring-orange-500"
                  />
                  <p className="text-xs text-muted-foreground">Brief description for your profile. URLs are hyperlinked.</p>
                </div>
              </CardContent>
              <CardFooter className="border-t border-border/50 pt-4 bg-muted/20 justify-end">
                <Button 
                  onClick={handleSave} 
                  disabled={updateMutation.isPending}
                  className="bg-orange-600 hover:bg-orange-700 text-white"
                >
                  {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <Save className="mr-2 h-4 w-4" /> Save Changes
                </Button>
              </CardFooter>
            </Card>
          </motion.div>

          {/* Placeholder for future settings */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-sm opacity-70">
              <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="flex items-center gap-2"><Key className="h-4 w-4 text-orange-500" /> Account Security</CardTitle>
                <CardDescription>Manage your password and active sessions.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Button variant="outline" className="w-full sm:w-auto">Change Password</Button>
              </CardContent>
            </Card>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
            <Card className="border-border/50 bg-card/60 backdrop-blur-sm shadow-sm opacity-70">
              <CardHeader className="border-b border-border/50 pb-4">
                <CardTitle className="flex items-center gap-2"><Bell className="h-4 w-4 text-orange-500" /> Notifications</CardTitle>
                <CardDescription>Control when and how you are notified.</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between p-4 border border-border/50 rounded-lg">
                  <div>
                    <p className="font-medium">Student Enrollments</p>
                    <p className="text-sm text-muted-foreground">Get notified when a new student enrolls.</p>
                  </div>
                  <div className="h-6 w-11 bg-orange-500 rounded-full relative cursor-pointer">
                    <div className="absolute right-1 top-1 h-4 w-4 bg-white rounded-full"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
