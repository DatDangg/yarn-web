import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export async function getCoordinates(address: string | number | boolean) {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data.length === 0) return {
        lat: 0,
        lon: 0,
    };
    else return {
        lat: parseFloat(data[0].lat),
        lon: parseFloat(data[0].lon),
    };
    
}

export function useDistanceCalculator(from: string, to: string) {
    const { t } = useTranslation()
    const [distance, setDistance] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function calculateDistance() {
            try {
                const coordFrom = await getCoordinates(from);
                const coordTo = await getCoordinates(to);
                console.log(coordTo)

                const response = await fetch("https://api.openrouteservice.org/v2/directions/driving-car", {
                    method: "POST",
                    headers: {
                        Authorization: "5b3ce3597851110001cf624882d96ec39cd04d35a4854928310e5d2c",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        coordinates: [
                            [coordFrom.lon, coordFrom.lat],
                            [coordTo.lon, coordTo.lat],
                        ],
                    }),
                });

                const data = await response.json();
                const summary = data.routes[0].summary;
                setDistance((summary.distance / 1000).toFixed(2));
            } catch (err: any) {
                toast.error(`${t('checkout2')}`)
                setError(err.message || "Unknown error occurred");
                setDistance(null);
            }
        }

        if (from && to) {
            calculateDistance();
        }
    }, [from, to]);

    return { distance, error };
}
