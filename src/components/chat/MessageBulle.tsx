interface Props {
  role: "user" | "assistant"
  contenu: string
}

export default function MessageBulle({ role, contenu }: Props) {
  const estUtilisateur = role === "user"

  return (
    <div className={`flex ${estUtilisateur ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
          estUtilisateur
            ? "rounded-br-md bg-orange text-white"
            : "rounded-bl-md bg-white text-gray-800 shadow-sm"
        }`}
      >
        {contenu}
      </div>
    </div>
  )
}
