import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addContact, updateContact } from "../api/contacts";
import { contactSchema } from "../schemas/contactSchema";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "./ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { toast } from "sonner";
import { Textarea } from "./ui/textarea";
import { Input } from "./ui/input";
import { useEffect } from "react";

const AddContact = ({
  open,
  onOpenChange,
  initialData = null,
  fetchContacts,
}) => {
  const isEdit = Boolean(initialData);
  const form = useForm({
    resolver: zodResolver(contactSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phoneNumber: "",
      message: "",
    },
  });

  // Reset form when initialData changes (switching between add/edit modes)
  useEffect(() => {
    form.reset(
      initialData || {
        name: "",
        email: "",
        phoneNumber: "",
        message: "",
      }
    );
  }, [initialData, form]);

  // Reset form when modal closes
  useEffect(() => {
    if (!open) {
      form.reset(
        initialData || {
          name: "",
          email: "",
          phoneNumber: "",
          message: "",
        }
      );
    }
  }, [open, initialData, form]);

  const onSubmit = async (values) => {
    if (isEdit) {
      const response = await updateContact(initialData._id, values);
      toast.success(response?.message || "Contact updated successfully!");
    } else {
      const response = await addContact(values);
      toast.success(response?.message || "Contact added successfully!");
    }
    form.reset();
    fetchContacts?.();
    if (onOpenChange) onOpenChange(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        if (!open) {
          form.reset();
        }
        if (onOpenChange) onOpenChange(open);
      }}
    >
      <DialogContent onOpenAutoFocus={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Contact" : "Add Contact"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              name="name"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter email" type="email" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="phoneNumber"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter 10-digit phone number"
                      maxLength={10}
                      type="tel"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="message"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter message (optional)"
                      maxLength={250}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">{isEdit ? "Update" : "Add"}</Button>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddContact;
