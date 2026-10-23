"use client";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import SearchInput from "./search-input";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { LoaderCircle, Upload } from "lucide-react";
import { toast } from "sonner";

const HomeNavbar = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [loginError, setLoginError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/auth/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((result: { authenticated?: boolean }) => {
        if (active) setIsAuthenticated(!!result.authenticated);
      })
      .catch(() => {
        if (active) setIsAuthenticated(false);
      });
    return () => {
      active = false;
    };
  }, []);

  const handleUploadOpenChange = (open: boolean) => {
    if (open && isAuthenticated) {
      fileInputRef.current?.click();
      return;
    }
    if (open) setLoginError("");
    setIsLoginOpen(open);
  };

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSigningIn(true);
    setLoginError("");
    try {
      const response = await fetch("/api/auth/session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result: { authenticated?: boolean; error?: string } =
        await response.json();
      if (!response.ok || !result.authenticated) {
        setLoginError(result.error || "Unable to sign in.");
        return;
      }
      setIsAuthenticated(true);
      setIsLoginOpen(false);
      setPassword("");
      fileInputRef.current?.click();
    } catch {
      setLoginError("Unable to sign in. Please try again.");
    } finally {
      setIsSigningIn(false);
    }
  };

  const uploadPhotos = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.currentTarget.files ?? []);
    event.currentTarget.value = "";
    if (files.length === 0) return;

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));

    setIsUploading(true);
    const toastId = toast.loading(
      `Uploading ${files.length} photo${files.length === 1 ? "" : "s"}...`,
    );
    try {
      const response = await fetch("/api/uploads", {
        method: "POST",
        body: formData,
      });
      const result: {
        uploadedCount?: number;
        failedCount?: number;
        error?: string;
      } = await response.json();

      if (response.status === 401) {
        setIsAuthenticated(false);
        setLoginError(result.error || "Please sign in to upload photos.");
        setIsLoginOpen(true);
        throw new Error(result.error || "Please sign in to upload photos.");
      }
      if (!response.ok && result.uploadedCount === undefined) {
        throw new Error(result.error || "Unable to upload photos.");
      }
      if (result.failedCount) {
        toast.error(
          `${result.uploadedCount ?? 0} uploaded; ${result.failedCount} failed.`,
          { id: toastId },
        );
      } else {
        toast.success(
          `${result.uploadedCount ?? 0} photo${result.uploadedCount === 1 ? "" : "s"} uploaded.`,
          { id: toastId },
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Unable to upload photos.",
        { id: toastId },
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 h-16 bg-white flex items-center px-2 pr-3 sm:pr-5 z-50">
      <div className="flex items-center gap-2 sm:gap-4 w-full min-w-0">
        <div className="flex items-center flex-shrink-0">
          <SidebarTrigger />
          <Link
            prefetch
            href="/"
            aria-label="Smith Family Slides home"
            className="flex items-center gap-1"
          >
            <div className="flex items-center gap-1 p-2 sm:p-4">
              <Image
                src="/images/default.jpg"
                alt="logo"
                width={40}
                height={40}
                className="rounded-sm"
              />
              <p className="hidden md:block text-2xl px-2 font-semibold tracking-tighter">
                Smith Family Slides
              </p>
            </div>
          </Link>
        </div>
        <div className="flex flex-1 min-w-0 justify-center max-w-[7000px] mx-auto">
          <div className="flex w-full max-w-[700px] min-w-0 items-center justify-center gap-2">
            <div className="min-w-0 max-w-[600px] flex-1">
              <SearchInput />
            </div>
            <Popover open={isLoginOpen} onOpenChange={handleUploadOpenChange}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  className="shrink-0"
                  aria-label={
                    isUploading ? "Uploading photos" : "Upload photos"
                  }
                  aria-busy={isUploading}
                  title={isUploading ? "Uploading photos..." : "Upload photos"}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <LoaderCircle className="animate-spin" />
                  ) : (
                    <Upload />
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                side="bottom"
                align="end"
                sideOffset={8}
                className="z-[60] w-80"
              >
                <form onSubmit={handleLogin} className="grid gap-4">
                  <div className="space-y-1">
                    <h4 className="font-medium leading-none">Sign in</h4>
                    <p className="text-sm text-muted-foreground">
                      Sign in to upload photos.
                    </p>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="upload-login-username">User name</Label>
                    <Input
                      id="upload-login-username"
                      type="text"
                      autoComplete="username"
                      autoCapitalize="none"
                      spellCheck={false}
                      required
                      value={username}
                      onChange={(event) => setUsername(event.target.value)}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="upload-login-password">Password</Label>
                    <Input
                      id="upload-login-password"
                      type="password"
                      autoComplete="current-password"
                      required
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                    />
                  </div>
                  {loginError && (
                    <p role="alert" className="text-sm text-destructive">
                      {loginError}
                    </p>
                  )}
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={isSigningIn}
                  >
                    {isSigningIn && <LoaderCircle className="animate-spin" />}
                    Sign in &amp; upload
                  </Button>
                </form>
              </PopoverContent>
            </Popover>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/avif,image/gif,image/heic,image/heif,image/jpeg,image/png,image/webp"
              multiple
              className="hidden"
              aria-label="Select photos to upload"
              disabled={isUploading}
              onChange={uploadPhotos}
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default HomeNavbar;
