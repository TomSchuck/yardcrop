"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Listing, ProduceType, AvailabilityStatus, ContactMethod, CreateListingInput } from "@/lib/types";
import { useListings } from "@/contexts/ListingsContext";
import ProduceTypeSelector from "./ProduceTypeSelector";
import AvailabilitySelector from "./AvailabilitySelector";
import ContactMethodSelector from "./ContactMethodSelector";
import PhotoUpload from "./PhotoUpload";
import LocationPicker from "./LocationPicker";

interface CreateListingFormProps {
  initialListing?: Listing;
  onSuccess?: (listing: Listing) => void;
}

export default function CreateListingForm({ initialListing, onSuccess }: CreateListingFormProps) {
  const router = useRouter();
  const { addListing, updateListing } = useListings();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEdit = !!initialListing;

  // Form state
  const [produceName, setProduceName] = useState(initialListing?.produceName || "");
  const [produceType, setProduceType] = useState<ProduceType | "">(initialListing?.produceType || "");
  const [description, setDescription] = useState(initialListing?.description || "");
  const [growerName, setGrowerName] = useState(initialListing?.growerName || "");
  const [neighborhood, setNeighborhood] = useState(initialListing?.neighborhood || "");
  const [latitude, setLatitude] = useState<number | null>(initialListing?.latitude || null);
  const [longitude, setLongitude] = useState<number | null>(initialListing?.longitude || null);
  const [availability, setAvailability] = useState<AvailabilityStatus>(initialListing?.availability || "now");
  const [availabilityDetails, setAvailabilityDetails] = useState(initialListing?.availabilityDetails || "");
  const [pickupInstructions, setPickupInstructions] = useState(initialListing?.pickupInstructions || "");
  const [contactMethod, setContactMethod] = useState<ContactMethod>(initialListing?.contactMethod || "phone");
  const [contactPhone, setContactPhone] = useState(initialListing?.contactPhone || "");
  const [contactEmail, setContactEmail] = useState(initialListing?.contactEmail || "");
  const [photoUrl, setPhotoUrl] = useState<string | null>(initialListing?.photoUrl || null);

  // Update form when initialListing changes (for edit mode)
  useEffect(() => {
    if (initialListing) {
      setProduceName(initialListing.produceName);
      setProduceType(initialListing.produceType);
      setDescription(initialListing.description);
      setGrowerName(initialListing.growerName);
      setNeighborhood(initialListing.neighborhood);
      setLatitude(initialListing.latitude);
      setLongitude(initialListing.longitude);
      setAvailability(initialListing.availability);
      setAvailabilityDetails(initialListing.availabilityDetails || "");
      setPickupInstructions(initialListing.pickupInstructions);
      setContactMethod(initialListing.contactMethod);
      setContactPhone(initialListing.contactPhone || "");
      setContactEmail(initialListing.contactEmail || "");
      setPhotoUrl(initialListing.photoUrl || null);
    }
  }, [initialListing]);

  const handleLocationChange = (lat: number, lng: number) => {
    setLatitude(lat);
    setLongitude(lng);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!produceType || !latitude || !longitude) {
      alert("Please fill in all required fields and set a location on the map.");
      return;
    }

    setIsSubmitting(true);

    // Simulate a small delay for UX
    await new Promise((resolve) => setTimeout(resolve, 300));

    const input: CreateListingInput = {
      produceName,
      produceType,
      description,
      growerName,
      neighborhood,
      latitude,
      longitude,
      availability,
      availabilityDetails: availability === "upcoming" ? availabilityDetails : undefined,
      pickupInstructions,
      contactMethod,
      contactPhone: contactMethod === "phone" || contactMethod === "both" ? contactPhone : undefined,
      contactEmail: contactMethod === "email" || contactMethod === "both" ? contactEmail : undefined,
      photoUrl: photoUrl || undefined,
    };

    if (isEdit && initialListing) {
      // Update existing listing
      const updated = updateListing(initialListing.id, input);
      if (updated && onSuccess) {
        onSuccess(updated);
      } else if (updated) {
        router.push("/dashboard");
      }
    } else {
      // Create new listing
      const newListing = addListing(input);
      if (onSuccess) {
        onSuccess(newListing);
      } else {
        router.push(`/?selected=${newListing.id}`);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Produce Name */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-charcoal">
          What are you sharing? <span className="text-error-red">*</span>
        </label>
        <input
          type="text"
          value={produceName}
          onChange={(e) => setProduceName(e.target.value)}
          placeholder="e.g., Meyer Lemons, Fresh Basil"
          required
          minLength={3}
          maxLength={100}
          className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-garden-green focus:ring-1 focus:ring-garden-green"
        />
      </div>

      {/* Produce Type */}
      <ProduceTypeSelector value={produceType} onChange={setProduceType} />

      {/* Description */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-charcoal">
          Description <span className="text-error-red">*</span>
        </label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell neighbors about your produce - how much you have, how it tastes, how you grew it..."
          required
          minLength={10}
          maxLength={500}
          rows={3}
          className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-garden-green focus:ring-1 focus:ring-garden-green resize-none"
        />
        <p className="text-xs text-warm-gray text-right">{description.length}/500</p>
      </div>

      {/* Photo */}
      <PhotoUpload previewUrl={photoUrl} onPhotoChange={setPhotoUrl} />

      {/* Grower Name */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-charcoal">
          Your Name <span className="text-error-red">*</span>
        </label>
        <input
          type="text"
          value={growerName}
          onChange={(e) => setGrowerName(e.target.value)}
          placeholder="e.g., Maria G."
          required
          minLength={2}
          maxLength={50}
          className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-garden-green focus:ring-1 focus:ring-garden-green"
        />
      </div>

      {/* Neighborhood */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-charcoal">
          Neighborhood <span className="text-error-red">*</span>
        </label>
        <input
          type="text"
          value={neighborhood}
          onChange={(e) => setNeighborhood(e.target.value)}
          placeholder="e.g., Carlsbad, Encinitas, Vista"
          required
          minLength={2}
          maxLength={50}
          className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-garden-green focus:ring-1 focus:ring-garden-green"
        />
      </div>

      {/* Location Picker */}
      <LocationPicker
        latitude={latitude}
        longitude={longitude}
        onChange={handleLocationChange}
      />

      {/* Availability */}
      <AvailabilitySelector
        value={availability}
        onChange={setAvailability}
        details={availabilityDetails}
        onDetailsChange={setAvailabilityDetails}
      />

      {/* Pickup Instructions */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-charcoal">
          Pickup Instructions <span className="text-error-red">*</span>
        </label>
        <textarea
          value={pickupInstructions}
          onChange={(e) => setPickupInstructions(e.target.value)}
          placeholder="e.g., On the porch at 123 Elm St. Text me when you're coming by."
          required
          minLength={10}
          maxLength={300}
          rows={2}
          className="w-full bg-cream border border-border rounded-lg px-3 py-2 text-charcoal placeholder:text-warm-gray focus:outline-none focus:border-garden-green focus:ring-1 focus:ring-garden-green resize-none"
        />
      </div>

      {/* Contact Method */}
      <ContactMethodSelector
        method={contactMethod}
        onMethodChange={setContactMethod}
        phone={contactPhone}
        onPhoneChange={setContactPhone}
        email={contactEmail}
        onEmailChange={setContactEmail}
      />

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-garden-green text-white font-semibold py-3 rounded-lg hover:bg-garden-green/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting
          ? isEdit
            ? "Saving..."
            : "Posting..."
          : isEdit
          ? "Save Changes"
          : "Post Your Produce"}
      </button>
    </form>
  );
}
