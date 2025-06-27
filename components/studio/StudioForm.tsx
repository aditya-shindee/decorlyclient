'use client';

import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { useDropzone } from 'react-dropzone';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { fadeIn, slideUp } from "@/lib/animations";
import { ROOM_TYPES, ROOM_THEMES, COLOR_PREFERENCES } from "@/lib/constants";
import { Home, Palette, ImageIcon, ArrowRight } from "lucide-react";

const formSchema = z.object({
  room_type: z.string().min(1, { message: "Room type is required" }),
  room_theme: z.string().optional(),
  color_preference: z.string().optional(),
  additional_instruction: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export function StudioForm() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      room_type: "",
      room_theme: "",
      color_preference: "",
      additional_instruction: "",
    },
  });

  const onDrop = useCallback((acceptedFiles: File[]) => {
    console.log('Accepted files:', acceptedFiles);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    maxFiles: 1
  });

  const onSubmit = (values: FormValues) => {
    console.log(values);
    alert("Form submitted successfully!");
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeIn}
      className="w-full"
    >
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl shadow-xl border border-purple-100 p-8 md:p-12">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Left Column - Room Details */}
              <motion.div 
                className="space-y-8"
                variants={slideUp}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500">
                    <Home className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Room Details</h2>
                  <span className="text-purple-500 text-sm">*</span>
                </div>

                <FormField
                  control={form.control}
                  name="room_type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Room Type <span className="text-purple-500">*</span></FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="h-12 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-purple-400/20">
                            <SelectValue placeholder="Select room type" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROOM_TYPES.map((type) => (
                              <SelectItem key={type.value} value={type.value}>
                                {type.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormLabel className="text-gray-700 font-medium">Upload Image</FormLabel>
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300
                      ${isDragActive 
                        ? 'border-purple-400 bg-purple-50' 
                        : 'border-gray-300 hover:border-purple-300 hover:bg-purple-50/50'
                      }`}
                  >
                    <input {...getInputProps()} />
                    <ImageIcon className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    {isDragActive ? (
                      <p className="text-purple-600 font-medium">Drop your image here</p>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-gray-600 font-medium">Drag & drop image</p>
                        <p className="text-sm text-gray-500">or</p>
                        <Button 
                          type="button" 
                          variant="outline" 
                          className="border-purple-200 text-purple-600 hover:bg-purple-50"
                        >
                          Browse
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>

              {/* Right Column - Style Preferences */}
              <motion.div 
                className="space-y-8"
                variants={slideUp}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500">
                    <Palette className="h-5 w-5 text-white" />
                  </div>
                  <h2 className="text-2xl font-semibold text-gray-900">Style Preferences</h2>
                </div>

                <FormField
                  control={form.control}
                  name="room_theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Theme <span className="text-gray-400 text-sm">(Optional)</span></FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="h-12 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-purple-400/20">
                            <SelectValue placeholder="Choose a theme" />
                          </SelectTrigger>
                          <SelectContent>
                            {ROOM_THEMES.map((theme) => (
                              <SelectItem key={theme.value} value={theme.value}>
                                {theme.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="color_preference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Color Palette <span className="text-gray-400 text-sm">(Optional)</span></FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <SelectTrigger className="h-12 border-gray-200 rounded-xl focus:border-purple-400 focus:ring-purple-400/20">
                            <SelectValue placeholder="Select color palette" />
                          </SelectTrigger>
                          <SelectContent>
                            {COLOR_PREFERENCES.map((color) => (
                              <SelectItem key={color.value} value={color.value}>
                                <div className="flex items-center gap-2">
                                  <div 
                                    className="w-4 h-4 rounded-full" 
                                    style={{ backgroundColor: color.hex }}
                                  />
                                  {color.label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="additional_instruction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">Instructions <span className="text-gray-400 text-sm">(Optional)</span></FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., 'Add lots of plants', 'I prefer gold accents'..."
                          className="min-h-[120px] border-gray-200 rounded-xl focus:border-purple-400 focus:ring-purple-400/20 resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </motion.div>
            </div>

            <motion.div
              className="flex justify-center pt-8"
              variants={slideUp}
            >
              <Button 
                type="submit" 
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 transition-all duration-300 group"
              >
                Design my space
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform duration-200" />
              </Button>
            </motion.div>
          </form>
        </Form>
      </div>
    </motion.div>
  );
}