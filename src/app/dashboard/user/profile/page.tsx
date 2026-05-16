"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useSession } from "@/lib/auth-client";
import { usersApi } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Loader2, Camera, Mail, Phone, MapPin, Globe, BookOpen, Trophy } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const schema = z.object({
  name: z.string().min(2),
  bio: z.string().max(300).optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  image: z.string().url().optional().or(z.literal("")),
});
type FormData = z.infer<typeof schema>;

export default function ProfilePage() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data: profileRes, isLoading } = useQuery({
    queryKey: ["user-profile"],
    queryFn: () => usersApi.getProfile().then((r) => r.data),
  });

  const profile = profileRes?.data;

  const { register, handleSubmit, formState: { errors, isDirty } } = useForm<FormData>({
    resolver: zodResolver(schema),
    values: {
      name: profile?.name || "",
      bio: profile?.bio || "",
      phone: profile?.phone || "",
      location: profile?.location || "",
      website: profile?.website || "",
      image: profile?.image || "",
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: FormData) => usersApi.updateProfile(data).then((r) => r.data),
    onSuccess: () => {
      toast.success("Profile updated successfully!");
      queryClient.invalidateQueries({ queryKey: ["user-profile"] });
    },
    onError: () => toast.error("Failed to update profile"),
  });

  if (isLoading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-muted-foreground text-sm mt-1">Manage your personal information</p>
      </div>

      {/* Profile card */}
      <Card className="border border-border">
        <CardContent className="p-6">
          <div className="flex items-start gap-5">
            <div className="relative">
              <Avatar className="h-20 w-20 border-4 border-border">
                <AvatarImage src={profile?.image || ""} />
                <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                  {profile?.name?.[0]}
                </AvatarFallback>
              </Avatar>
              <button className="absolute bottom-0 right-0 p-1.5 bg-primary rounded-full text-primary-foreground hover:bg-primary/90 transition-colors">
                <Camera className="h-3 w-3" />
              </button>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold">{profile?.name}</h2>
              <p className="text-muted-foreground text-sm flex items-center gap-1.5 mt-1">
                <Mail className="h-3.5 w-3.5" /> {profile?.email}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{profile?.role}</Badge>
                <Badge variant="outline" className="text-green-600 border-green-300">Active</Badge>
              </div>
            </div>
            <div className="hidden sm:flex gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-primary">{profile?._count?.enrollments || 0}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1"><BookOpen className="h-3 w-3" /> Enrolled</div>
              </div>
              <Separator orientation="vertical" />
              <div>
                <div className="text-2xl font-bold text-green-500">{profile?._count?.courses || 0}</div>
                <div className="text-xs text-muted-foreground flex items-center gap-1"><Trophy className="h-3 w-3" /> Completed</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Edit form */}
      <Card className="border border-border">
        <CardHeader>
          <CardTitle>Edit Information</CardTitle>
          <CardDescription>Update your profile details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit((d) => updateMutation.mutate(d))} className="space-y-5">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Full Name *</Label>
                <Input {...register("name")} placeholder="John Doe" className={errors.name ? "border-destructive" : ""} />
                {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Profile Image URL</Label>
                <Input {...register("image")} placeholder="https://..." />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Bio</Label>
              <Textarea
                {...register("bio")}
                placeholder="Tell us about yourself..."
                className="resize-none h-24"
              />
              {errors.bio && <p className="text-xs text-destructive">{errors.bio.message}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><Phone className="h-3.5 w-3.5" /> Phone</Label>
                <Input {...register("phone")} placeholder="+1 (555) 000-0000" />
              </div>
              <div className="space-y-1.5">
                <Label className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" /> Location</Label>
                <Input {...register("location")} placeholder="San Francisco, CA" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="flex items-center gap-1.5"><Globe className="h-3.5 w-3.5" /> Website</Label>
              <Input {...register("website")} placeholder="https://yourwebsite.com" />
              {errors.website && <p className="text-xs text-destructive">{errors.website.message}</p>}
            </div>

            <Button type="submit" disabled={updateMutation.isPending || !isDirty} className="w-full sm:w-auto">
              {updateMutation.isPending ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...</>
              ) : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
