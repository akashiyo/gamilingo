"use client";

import OneCard from "./OneCard/OneCard";

interface CardInfo {
  title: string;
  description: string;
  buttonText: string;
  image: string;
  bgColor: string;
  buttonColor: string;
  buttonHoverColor: string;
}

export default function CardsPage() {
  const cardsData: CardInfo[] = [
    {
      title: "Animals",
      description:
        "Learn the names of all commonly or uniquely encountered animals.",
      buttonText: "Commencer !",
      image:
        "https://images.pexels.com/photos/416160/pexels-photo-416160.jpeg",
      bgColor: "#EFE9F7",
      buttonColor: "#7A4A9C",
      buttonHoverColor: "#7A4A9C",
    },
    {
      title: "Family",
      description: "Learn common words for family members and relationships.",
      buttonText: "Commencer !",
      image:
        "https://images.pexels.com/photos/2133/man-person-cute-young.jpg",
      bgColor: "#E4F5E2",
      buttonColor: "#3B9933",
      buttonHoverColor: "#3B9933",
    },
    {
      title: "Jobs",
      description: "Learn the names of common and unexpected jobs.",
      buttonText: "Commencer !",
      image:
        "https://images.pexels.com/photos/375889/pexels-photo-375889.jpeg",
      bgColor: "#EBF1FE",
      buttonColor: "#3363CC",
      buttonHoverColor: "#3363CC",
    },
    {
      title: "Foods",
      description:
        "Learn the names of the most common vegetables, fruits, etc.",
      buttonText: "Commencer !",
      image:
        "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg",
      bgColor: "#F7E4DF",
      buttonColor: "#D16447",
      buttonHoverColor: "#D16447",
    },
    {
      title: "Emotions / Feelings",
      description:
        "Learn the most common emotions from joy to despair.",
      buttonText: "Commencer !",
      image:
        "https://images.pexels.com/photos/34775645/pexels-photo-34775645.jpeg",
      bgColor: "#EFE9F7",
      buttonColor: "#7A4A9C",
      buttonHoverColor: "#7A4A9C",
    },
  ];

  return (
    <main className="flex flex-col items-center gap-10 p-10">
      <h2 className="my-2 text-start">Toutes les cartes</h2>

      {cardsData.map((card, i) => (
        <OneCard key={i} {...card} navigateToGames={true} level={1} />
      ))}
    </main>
  );
}
