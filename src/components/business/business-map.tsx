interface BusinessMapProps {
  latitude: number | null;
  longitude: number | null;
  name: string;
  address: string | null;
  googleMapsUrl: string | null;
}

export function BusinessMap({ latitude, longitude, name, address, googleMapsUrl }: BusinessMapProps) {
  if (!latitude || !longitude) {
    if (!address) return null;
    return (
      <div className="bg-stone-100 rounded-[var(--radius-card)] p-6 text-center">
        <p className="text-stone-600 text-sm mb-2">{address}</p>
        {googleMapsUrl && (
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-brand-600 hover:text-brand-700 font-medium"
          >
            View on Google Maps
          </a>
        )}
      </div>
    );
  }

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const embedUrl = apiKey
    ? `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${latitude},${longitude}&zoom=15`
    : `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  return (
    <div className="rounded-[var(--radius-card)] overflow-hidden">
      <iframe
        src={embedUrl}
        width="100%"
        height="256"
        className="border-0 h-64 md:h-80 w-full"
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        title={`Map showing ${name} location`}
      />
      {address && (
        <div className="bg-surface-raised px-4 py-3 border-t border-stone-200">
          <p className="text-sm text-stone-600">{address}</p>
        </div>
      )}
    </div>
  );
}
