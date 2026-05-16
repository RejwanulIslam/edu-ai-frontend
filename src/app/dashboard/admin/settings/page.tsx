"use client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Settings, Globe, Shield, Zap } from "lucide-react";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold">Platform Settings</h1>
        <p className="text-muted-foreground text-sm mt-1">Configure global platform settings</p>
      </div>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Globe className="h-4 w-4" /> General</CardTitle>
          <CardDescription>Basic platform configuration</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Platform Name</Label>
            <Input defaultValue="EduAI" />
          </div>
          <div className="space-y-1.5">
            <Label>Support Email</Label>
            <Input defaultValue="support@eduai.dev" type="email" />
          </div>
          <div className="space-y-1.5">
            <Label>Frontend URL</Label>
            <Input defaultValue="https://eduai.vercel.app" />
          </div>
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Zap className="h-4 w-4" /> Features</CardTitle>
          <CardDescription>Enable or disable platform features</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: "AI Study Assistant", desc: "Allow students to use the AI chatbot", defaultChecked: true },
            { label: "AI Recommendations", desc: "Show AI-powered course suggestions", defaultChecked: true },
            { label: "AI Quiz Generator", desc: "Allow instructors to generate AI quizzes", defaultChecked: true },
            { label: "Google Sign-in", desc: "Allow sign-in with Google account", defaultChecked: true },
            { label: "Free Course Enrollment", desc: "Allow enrollment without payment for free courses", defaultChecked: true },
            { label: "User Reviews", desc: "Allow students to leave course reviews", defaultChecked: true },
          ].map((feature) => (
            <div key={feature.label} className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{feature.label}</p>
                <p className="text-xs text-muted-foreground">{feature.desc}</p>
              </div>
              <Switch defaultChecked={feature.defaultChecked} />
            </div>
          ))}
        </CardContent>
      </Card>

      <Card className="border border-border">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2"><Shield className="h-4 w-4" /> Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Require email verification</p>
              <p className="text-xs text-muted-foreground">New users must verify their email</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Rate limiting</p>
              <p className="text-xs text-muted-foreground">Protect API from abuse</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      <Button onClick={() => toast.success("Settings saved!")} className="w-full sm:w-auto">
        Save Platform Settings
      </Button>
    </div>
  );
}
