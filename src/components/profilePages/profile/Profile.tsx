'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Edit2, Save, X, Camera } from 'lucide-react';

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  image: string;
}

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileFormData>({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    image: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John',
  });

  const { register, handleSubmit, reset } = useForm<ProfileFormData>({
    defaultValues: profileData,
  });

  // const imageUrl = watch('image');

  const onSubmit = (data: ProfileFormData) => {
    setProfileData(data);
    setIsEditing(false);
  };

  const handleCancel = () => {
    reset(profileData);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageData = event.target?.result as string;
        setProfileData((prev) => ({
          ...prev,
          image: imageData,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 flex flex-col py-8 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Profile</h1>
          <p className="mt-2 text-muted-foreground">Manage your personal information</p>
        </div>
        <Card className="overflow-hidden">
          {/* Header Section with Avatar */}
          <div className="border-b border-border bg-gradient-to-r from-primary/5 to-accent/5 px-6 py-8">
            <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={profileData.image || '/placeholder.svg'}
                    alt={`${profileData.firstName} ${profileData.lastName}`}
                  />
                  <AvatarFallback>
                    {profileData.firstName.charAt(0)}
                    {profileData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <label className="absolute bottom-0 right-0 flex cursor-pointer items-center justify-center rounded-full bg-primary p-2 text-primary-foreground hover:bg-primary/90">
                    <Camera size={16} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left">
                <h2 className="text-2xl font-bold text-foreground">
                  {profileData.firstName} {profileData.lastName}
                </h2>
                <p className="mt-1 text-muted-foreground">{profileData.email}</p>
                <p className="text-sm text-muted-foreground">{profileData.phone}</p>
              </div>

              <div>
                {!isEditing ? (
                  <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
                    <Edit2 size={18} />
                    Edit Profile
                  </Button>
                ) : null}
              </div>
            </div>
          </div>

          {/* Form Section */}
          <div className="p-6">
            {isEditing ? (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-foreground">
                      First Name
                    </Label>
                    <Input
                      id="firstName"
                      placeholder="First name"
                      {...register('firstName', { required: true })}
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-foreground">
                      Last Name
                    </Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      {...register('lastName', { required: true })}
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-foreground">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your.email@example.com"
                      {...register('email', { required: true })}
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-foreground">
                      Phone Number
                    </Label>
                    <Input
                      id="phone"
                      placeholder="+1 (555) 000-0000"
                      {...register('phone', { required: true })}
                      className="border-border bg-background text-foreground placeholder:text-muted-foreground"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="gap-2">
                    <Save size={18} />
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="gap-2 bg-transparent"
                  >
                    <X size={18} />
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="grid gap-6 sm:grid-cols-2">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">First Name</p>
                    <p className="mt-2 text-lg text-foreground">{profileData.firstName}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Last Name</p>
                    <p className="mt-2 text-lg text-foreground">{profileData.lastName}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Email Address</p>
                    <p className="mt-2 text-lg text-foreground">{profileData.email}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Phone Number</p>
                    <p className="mt-2 text-lg text-foreground">{profileData.phone}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Card>

        {/* Info Cards */}
        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Member Since</div>
            <p className="mt-2 text-xl font-semibold text-foreground">2023</p>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Orders Placed</div>
            <p className="mt-2 text-xl font-semibold text-foreground">24</p>
          </Card>

          <Card className="p-6">
            <div className="text-sm font-medium text-muted-foreground">Wishlist Items</div>
            <p className="mt-2 text-xl font-semibold text-foreground">8</p>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
