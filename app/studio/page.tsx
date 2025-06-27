'use client';

import React, { useEffect, useState } from "react";
import { Home as HomeIcon, Coins, Palette as PaletteIcon, X, Image as ImageIcon, Sofa, BedDouble, Bath, Laptop, UtensilsCrossed, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ButtonColorful } from "@/components/ui/button-colorful";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import { getSupabaseUserId } from "@/utils/get-supabase-user";
import { uploadImageToStorage } from "@/utils/upload-image";


const colorOptions = [
  {
    value: "scandinavian_minimal",
    label: "Scandinavian Minimal",
    colors: ["#F4F4F4", "#D1D5DB", "#374151"], // Soft Off-White, Light Neutral Gray, Charcoal
  },
  {
    value: "boho_chic",
    label: "Boho Chic",
    colors: ["#C75D3A", "#A3B18A", "#FDFCDC"], // Terracotta, Sage Green, Cream
  },
  {
    value: "coastal_vibes",
    label: "Coastal Vibes",
    colors: ["#F0EAD6", "#A7C7E7", "#F8F9FA"], // Sandy Beige, Soft Water Blue, Crisp Off-White
  },
  {
    value: "earthy_tones",
    label: "Earthy Tones",
    colors: ["#6B4F4F", "#A95C37", "#556B2F"], // Deep Brown, Terracotta Clay, Olive Green
  },
  {
    value: "pastel_dream",
    label: "Pastel Dream",
    colors: ["#FFB6C1", "#BDE0FE", "#C7EAD6"], // Pastel Pink, Pastel Blue, Pastel Mint
  },
];

// Theme options with images
const themeOptions = [
  { 
    value: "modern", 
    label: "Modern", 
    imageUrl: "https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/static-images//modern.png",
    description: "Clean & contemporary"
  },
  { 
    value: "minimalist", 
    label: "Minimalist", 
    imageUrl: "https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/static-images//minimalist.png",
    description: "Less is more approach"
  },
  { 
    value: "scandinavian", 
    label: "Scandinavian", 
    imageUrl: "https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/static-images//scandavian.png",
    description: "Light & functional"
  },
  { 
    value: "industrial", 
    label: "Industrial", 
    imageUrl: "https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/static-images//industrial.png",
    description: "Raw & urban aesthetic"
  },
  { 
    value: "bohemian", 
    label: "Bohemian", 
    imageUrl: "https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/static-images//bohemian.png",
    description: "Free-spirited & eclectic"
  },
  { 
    value: "coastal", 
    label: "Coastal", 
    imageUrl: "https://xzecfauvsumzwqgquzga.supabase.co/storage/v1/object/public/static-images//costal.png",
    description: "Beach-inspired & breezy"
  }
];


export default function StudioPage() {
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }, []);

  const [roomImage, setRoomImage] = useState<string | null>(null);
  const [isDefaultImage, setIsDefaultImage] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showCreditsModal, setShowCreditsModal] = useState(false);
  const [roomType, setRoomType] = useState<string>("");
  const [theme, setTheme] = useState<string>("");
  const [colorPalette, setColorPalette] = useState<string>("");
  const [additionalInstructions, setAdditionalInstructions] = useState<string>("");
  const { user, isLoaded, isSignedIn } = useUser();
  const [isLoading, setIsLoading] = useState(true);
  const [supabaseUserId, setSupabaseUserId] = useState<string | null>(null);
  const [userCredits, setUserCredits] = useState(0);
  const [showInsufficientCreditsModal, setShowInsufficientCreditsModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  useEffect(() => {
    async function getUserId() {
      if (isLoaded && isSignedIn && user) {
        try {
          const userId = await getSupabaseUserId(user.id);
          setSupabaseUserId(userId);
        } catch (error) {
          console.error('Error getting Supabase user ID:', error);
        } finally {
          setIsLoading(false);
        }
      } else if (isLoaded) {
        setIsLoading(false);
      }
    }

    getUserId();
  }, [isLoaded, isSignedIn, user]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setRoomImage(e.target?.result as string);
        setIsDefaultImage(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDefaultImageSelect = (imageUrl: string) => {
    setRoomImage(imageUrl);
    setIsDefaultImage(true);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setRoomImage(e.target?.result as string);
        setIsDefaultImage(false);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async () => {
    // Check if user is signed in first
    if (!isSignedIn) {
      setShowLoginModal(true);
      return;
    }

    // Validate room type is selected
    if (!roomType) {
      alert('Please select a room type before submitting.');
      return;
    }

    setIsSubmitting(true);
    try {
      // First check credits
      const creditsResponse = await fetch(`/api/get-credits?userId=${supabaseUserId}`);
      const creditsData = await creditsResponse.json();

      if (!creditsResponse.ok) {
        throw new Error(creditsData.error || 'Failed to check credits');
      }

      if (creditsData.credits < 15) {
        setUserCredits(creditsData.credits);
        setShowInsufficientCreditsModal(true);
        return;
      }

      // Upload image to Supabase storage only if it's not a default image
      let roomImageUrl = null;
      if (roomImage) {
        if (isDefaultImage) {
          // Use the default image URL directly
          roomImageUrl = roomImage;
        } else {
          // Upload custom image to storage
          try {
            roomImageUrl = await uploadImageToStorage(
              roomImage,
              `${roomType}-${Date.now()}.jpg`
            );
          } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload room image');
          }
        }
      }

      console.log('roomImageUrl', roomImageUrl);

      // Create space with the uploaded image URL
      const response = await fetch('/api/create-spaces', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: supabaseUserId,
          roomType,
          roomImageUrl,
          theme,
          colorPalette,
          additionalInstructions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create space');
      }

      // Redirect to the space page
      router.push(`/studio/${data.space.id}`);
    } catch (error) {
      console.error('Error creating space:', error);
      // You might want to show an error message here
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-[#8338EC] rounded-full animate-spin mx-auto"></div>
          </div>
          <p className="text-gray-500 text-sm font-medium">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gray-100 p-2 sm:p-2">
      <div className="bg-white/95 backdrop-blur-sm rounded-xl w-full md:h-full shadow-xl border border-gray-100 relative z-10 overflow-hidden">
        {/* Subtle purple gradient blob in top-left */}
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-[#a084fa]/40 to-transparent rounded-full filter blur-2xl z-0 pointer-events-none" />
        {/* Blurred background blobs */}
        
        <div className="md:h-full rounded-xl bg-gradient-to-br from-white/80 via-white/90 to-white/95 p-2 sm:p-2 md:p-8 flex items-center justify-center relative">
          
          <div className="absolute bottom-[-20px] right-[-20px] w-[250px] h-[250px] bg-[#8338EC] opacity-50 rounded-full filter blur-[100px] z-0" />

          <div className="w-full max-w-4xl mx-auto">
              <Card className="w-full h-full bg-transparent border-none shadow-none rounded-2xl"> 
                <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
                  <div className="absolute inset-0 bg-white opacity-50" />
                </div>
                
                <CardContent className="p-6 sm:p-8 md:p-10 relative">
                  <div className="mb-12 text-center">
                    <h2 className="text-4xl md:text-5xl font-extrabold tracking-tighter mb-4">
                      <span className="bg-gradient-to-br from-[#8338EC] to-[#E040FB] text-transparent bg-clip-text px-1">
                        Design Your Space
                      </span>
                    </h2>
                    <p className="text-base md:text-base text-slate-600 max-w-3xl mx-auto leading-relaxed">
                      Fill in the details below and let our AI craft the perfect room, just for you.
                    </p>
                  </div>

                <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
                  {/* Left Column - Room Details */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-4 mb-5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#a084fa] to-[#8338EC] flex items-center justify-center shadow-md shadow-[#8338EC]/30">
                              <HomeIcon className="w-5 h-5 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800">
                              Room Details
                          </h3>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label htmlFor="roomType" className="block text-sm font-medium text-gray-600 mb-1.5">
                            Room Type <span className="text-[#8338EC] text-sm">*</span>
                          </label>
                          <Select onValueChange={setRoomType} value={roomType}>
                            <SelectTrigger 
                              id="roomType" 
                              className="w-full h-12 bg-gray-50/80 border-gray-200 rounded-lg text-sm font-medium hover:border-[#8338EC]/50 transition-all duration-200 focus:ring-2 focus:ring-[#8338EC]/50 focus:border-[#8338EC] focus:bg-white [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_svg]:shrink-0 [&>span_svg]:text-muted-foreground/80"
                            >
                              <SelectValue placeholder="Select room type" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg border-gray-200 shadow-xl bg-white/80 backdrop-blur-md [&_*[role=option]>span>svg]:text-muted-foreground/80 [&_*[role=option]>span]:flex [&_*[role=option]>span]:gap-2 [&_*[role=option]>span>svg]:shrink-0">
                              <SelectItem value="livingroom" className="rounded-md text-sm cursor-pointer">
                                <Sofa size={16} aria-hidden="true" />
                                <span className="truncate">Living Room</span>
                              </SelectItem>
                              <SelectItem value="bedroom" className="rounded-md text-sm cursor-pointer">
                                <BedDouble size={16} aria-hidden="true" />
                                <span className="truncate">Bedroom</span>
                              </SelectItem>
                              <SelectItem value="bathroom" className="rounded-md text-sm cursor-pointer">
                                <Bath size={16} aria-hidden="true" />
                                <span className="truncate">Bathroom</span>
                              </SelectItem>
                              <SelectItem value="homeoffice" className="rounded-md text-sm cursor-pointer">
                                <Laptop size={16} aria-hidden="true" />
                                <span className="truncate">Home Office</span>
                              </SelectItem>
                              <SelectItem value="diningroom" className="rounded-md text-sm cursor-pointer">
                                <UtensilsCrossed size={16} aria-hidden="true" />
                                <span className="truncate">Dining Room</span>
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-600 mb-1.5">Upload Image <span className="text-xs text-gray-400 font-normal">(Optional)</span></label>
                          <div
                            className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center text-center transition-all duration-300 min-h-[200px] group
                              ${isDragging ? 'border-[#8338EC] bg-[#8338EC]/10 ring-2 ring-[#8338EC]/30' : 'border-gray-300 hover:border-gray-400/80'}
                              ${roomImage ? 'border-[#8338EC]/50 bg-gray-50/50' : 'bg-gray-50/50 hover:bg-gray-100/50'}`}
                            onDragEnter={handleDragEnter} onDragLeave={handleDragLeave} onDragOver={handleDragOver} onDrop={handleDrop}>
                            {roomImage ? (
                              <div className="relative w-full h-full flex flex-col items-center justify-center">
                                <img src={roomImage} alt="Room preview" className="max-h-32 w-auto object-contain rounded-md shadow-sm" />
                                <Button variant="ghost" size="sm" onClick={() => {setRoomImage(null); setIsDefaultImage(false);}} className="absolute top-1 right-1 h-7 w-7 p-0 bg-white/50 hover:bg-white rounded-full text-gray-500 hover:text-[#8338EC] transition-colors">
                                  <X className="h-4 w-4" />
                                </Button>
                                {isDefaultImage && (
                                  <p className="text-xs text-[#8338EC] mt-2">Default image selected</p>
                                )}
                              </div>
                            ) : (
                              <>
                                <ImageIcon className={`h-10 w-10 mb-2 transition-colors duration-300 ${isDragging ? 'text-[#8338EC]' : 'text-gray-400 group-hover:text-gray-500'}`} />
                                <p className="text-sm font-semibold text-gray-600 mb-1">
                                  Drag & drop image of an empty room
                                </p>
                                <p className="text-xs text-gray-500 mb-2">or</p>
                                <input type="file" accept="image/*" className="hidden" id="room-image-input" onChange={handleImageUpload} />
                                <label htmlFor="room-image-input" className="px-4 py-1.5 bg-gray-200/80 text-gray-700 rounded-md cursor-pointer hover:bg-gray-300/80 transition-all duration-200 font-medium text-xs">
                                  Browse
                                </label>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Style Preferences */}
                  <div className="space-y-6">
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#FF006E] to-[#FFBE0B] flex items-center justify-center shadow-md shadow-[#FFBE0B]/30">
                              <PaletteIcon className="w-6 h-6 text-white" />
                          </div>
                          <h3 className="text-2xl font-bold text-gray-800">
                              Style Preferences
                          </h3>
                      </div>

                      <div className="space-y-5">
                        <div>
                          <label htmlFor="roomTheme" className="block text-sm font-medium text-gray-600 mb-1.5">Theme <span className="text-xs text-gray-400 font-normal">(Optional)</span></label>
                          <Select onValueChange={setTheme} value={theme}>
                            <SelectTrigger 
                              id="roomTheme" 
                              className="w-full h-auto ps-2 text-left bg-gray-50/80 border-gray-200 rounded-lg text-sm font-medium hover:border-[#8338EC]/50 transition-all duration-200 focus:ring-2 focus:ring-[#8338EC]/50 focus:border-[#8338EC] focus:bg-white [&>span]:flex [&>span]:items-center [&>span]:gap-2 [&>span_img]:shrink-0"
                            >
                              <SelectValue placeholder="Choose a theme" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg border-gray-200 shadow-xl bg-white/80 backdrop-blur-md [&_*[role=option]]:ps-2 [&_*[role=option]]:pe-8 [&_*[role=option]>span]:start-auto [&_*[role=option]>span]:end-2">
                              {themeOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="rounded-md text-sm hover:bg-gray-100 focus:bg-gray-100 cursor-pointer">
                                  <span className="flex items-center gap-2">
                                    <img
                                      className="rounded-md"
                                      src={option.imageUrl}
                                      alt={option.label}
                                      width={60}
                                      height={45}
                                    />
                                    <span>
                                      <span className="block font-medium">{option.label}</span>
                                      <span className="text-muted-foreground mt-0.5 block text-xs">
                                        {option.description}
                                      </span>
                                    </span>
                                  </span>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label htmlFor="colorPalette" className="block text-sm font-medium text-gray-600 mb-1.5">Color Palette <span className="text-xs text-gray-400 font-normal">(Optional)</span></label>
                          <Select onValueChange={setColorPalette} value={colorPalette}>
                            <SelectTrigger id="colorPalette" className="w-full h-12 bg-gray-50/80 border-gray-200 rounded-lg text-sm font-medium hover:border-[#8338EC]/50 transition-all duration-200 focus:ring-2 focus:ring-[#8338EC]/50 focus:border-[#8338EC] focus:bg-white">
                              <SelectValue placeholder="Select color palette" />
                            </SelectTrigger>
                            <SelectContent className="rounded-lg border-gray-200 shadow-xl bg-white/80 backdrop-blur-md max-h-72">
                              {colorOptions.map((option) => (
                                <SelectItem key={option.value} value={option.value} className="rounded-md text-sm hover:bg-gray-100 focus:bg-gray-100 cursor-pointer py-2">
                                  <div className="flex items-center justify-between w-full">
                                    <span>{option.label}</span>
                                    <div className="flex gap-1 ml-3">
                                      {option.colors.map((color, index) => (
                                        <div key={index} className="w-4 h-4 rounded-full border border-gray-300/50 shadow-sm" style={{ backgroundColor: color }} />
                                      ))}
                                    </div>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <label htmlFor="additionalInstructions" className="block text-sm font-medium text-gray-600 mb-1.5">Instructions <span className="text-xs text-gray-400 font-normal">(Optional)</span></label>
                          <Textarea 
                            id="additionalInstructions" 
                            placeholder="e.g., 'Add lots of plants', 'I prefer gold accents'..." 
                            className="min-h-[115px] bg-gray-50/80 border-gray-200 rounded-lg text-sm resize-none hover:border-[#8338EC]/50 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-[#8338EC]/50 focus-visible:border-[#8338EC] focus-visible:bg-white p-3"
                            value={additionalInstructions}
                            onChange={(e) => setAdditionalInstructions(e.target.value)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-2 pt-6 flex justify-center">
                  <ButtonColorful
                    label={
                      isSubmitting ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-black rounded-full animate-spin"></div>
                          <span>Designing...</span>
                        </div>
                      ) : (
                        "Design my space"
                      )
                    }
                    className={`px-8 py-2.5 h-auto text-base font-semibold rounded-lg shadow-sm hover:shadow-xl transition-all duration-300 transform hover:scale-105 active:scale-100 disabled:opacity-60 disabled:cursor-not-allowed ${
                      !roomType ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleSubmit}
                    disabled={isSubmitting || !roomType}
                  />
                </div>
              </CardContent>
            </Card>
            {/* </ShineBorder> */}
          </div>
        </div>
      </div>
      {showInsufficientCreditsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Insufficient Credits</h3>
              <button
                onClick={() => setShowInsufficientCreditsModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mb-4">
                <Coins className="w-8 h-8 text-yellow-600" />
              </div>
              <p className="text-gray-600 mb-2">
                You need at least <span className="font-semibold">15 credits</span> to Create a space.
              </p>
              <p className="text-sm text-gray-500">
                Current balance: <span className="font-medium">{userCredits} credits</span>
              </p>
            </div>
            <div className="text-center">
              <Button 
                className="w-full bg-[#8338EC] hover:bg-[#7c3aed]"
                onClick={() => window.open(`mailto:aditya12081998@gmail.com?subject=Credit Request&body=Hello,%0D%0A%0D%0AI would like to request additional credits for my account.%0D%0A%0D%0AMy userid: ${supabaseUserId}.%0D%0A%0D%0AThank you.`, '_blank')}
              >
                Request Credits from Admin
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLoginModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-md mx-4 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Sign In Required</h3>
              <button
                onClick={() => setShowLoginModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-[#8338EC]/10 rounded-full flex items-center justify-center mb-4">
                <LogIn className="w-8 h-8 text-[#8338EC]" />
              </div>
              <p className="text-gray-600 mb-2">
                You need to sign in to design your space.
              </p>
              <p className="text-sm text-gray-500">
                Create an account or sign in to start designing your perfect room.
              </p>
            </div>
            <div className="space-y-3">
              <Button 
                className="w-full bg-[#8338EC] hover:bg-[#7c3aed]"
                onClick={() => {
                  const currentUrl = window.location.href;
                  router.push(`/sign-in?redirect_url=${encodeURIComponent(currentUrl)}`);
                }}
              >
                Sign In
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  const currentUrl = window.location.href;
                  router.push(`/sign-up?redirect_url=${encodeURIComponent(currentUrl)}`);
                }}
                className="w-full"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
