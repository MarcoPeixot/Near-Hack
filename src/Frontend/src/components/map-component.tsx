"use client"

import { useEffect, useRef } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { X } from "lucide-react"

interface Instituicao {
  id: number
  nome: string
  tipo: string
  endereco: string
  cidade: string
  estado: string
  lat: number
  lng: number
}

interface DetalhesEscola {
  quantidadeAlunos: number
  alunosHonra: number
  enderecoBanco: string
  alunosMaisHonra: { nome: string; honras: number }[]
}

interface MapComponentProps {
  instituicoes: Instituicao[]
  instituicaoSelecionada: number | null
  setInstituicaoSelecionada: (id: number) => void
  detalhesEscola: DetalhesEscola | null
  detalhesBoxVisivel: boolean
  onAbrirDetalhesBox: (id: number) => void
  onFecharDetalhesBox: () => void
}

function CenterMap({
  instituicao,
  zoom,
}: {
  instituicao: Instituicao | null
  zoom: number
}) {
  const map = useMap()

  useEffect(() => {
    if (instituicao) {
      map.flyTo([instituicao.lat, instituicao.lng], zoom, {
        animate: true,
        duration: 1.5,
      })
    }
  }, [instituicao, map, zoom])

  return null
}

export default function MapComponent({
  instituicoes,
  instituicaoSelecionada,
  setInstituicaoSelecionada,
  detalhesEscola,
  detalhesBoxVisivel,
  onAbrirDetalhesBox,
  onFecharDetalhesBox,
}: MapComponentProps) {
  const popupRefs = useRef<{ [key: number]: L.Popup }>({})
  const markerRefs = useRef<{ [key: number]: L.Marker }>({})

  // Encontrar a instituição selecionada
  const instituicaoAtiva = instituicoes.find((inst) => inst.id === instituicaoSelecionada) || null

  useEffect(() => {
    if (instituicaoSelecionada && popupRefs.current[instituicaoSelecionada]) {
      setTimeout(() => {
        const popup = popupRefs.current[instituicaoSelecionada]
        if (popup && !popup.isPopupOpen()) {
          popup.openPopup()
        }
      }, 100)
    }
  }, [instituicaoSelecionada])

  useEffect(() => {
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
      iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
      shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    })
  }, [])

  // Caixa de detalhes flutuante
  const DetalhesBox = () => {
    if (!detalhesEscola || !detalhesBoxVisivel || !instituicaoAtiva) return null
    return (
      <div className="absolute top-4 right-4 w-80 bg-white rounded-lg shadow-lg z-[1000] border border-gray-200">
        <div className="p-4">
          <div className="flex justify-between items-start mb-3">
            <h3 className="font-semibold text-sky-900">{instituicaoAtiva.nome}</h3>
            <button
              onClick={onFecharDetalhesBox}
              className="text-gray-500 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="text-sm space-y-2">
            <p className="text-gray-600">{instituicaoAtiva.endereco}</p>
            <p className="text-gray-500 text-xs">
              {instituicaoAtiva.cidade}, {instituicaoAtiva.estado}
            </p>
            <div className="pt-2 border-t border-gray-100">
              <p className="flex justify-between">
                <span className="text-gray-600">Quantidade de alunos:</span>
                <span className="font-medium">{detalhesEscola.quantidadeAlunos}</span>
              </p>
              <p className="flex justify-between">
                <span className="text-gray-600">Alunos com honras:</span>
                <span className="font-medium">{detalhesEscola.alunosHonra}</span>
              </p>
              <p className="text-gray-600 mt-2">Endereço (BD):</p>
              <p className="text-gray-800">{detalhesEscola.enderecoBanco}</p>
            </div>
            <div className="pt-2">
              <p className="text-gray-600 font-medium">Alunos com mais honras:</p>
              {detalhesEscola.alunosMaisHonra.length > 0 ? (
                <ul className="mt-1 space-y-1">
                  {detalhesEscola.alunosMaisHonra.map((aluno, idx) => (
                    <li key={idx} className="flex justify-between">
                      <span>{aluno.nome}</span>
                      <span className="font-medium">{aluno.honras} honras</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 text-sm italic">
                  Nenhum talento registrado nesta escola.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[-15.7801, -47.9292]}
        zoom={4}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {instituicoes.map((inst) => (
          <Marker
            key={inst.id}
            position={[inst.lat, inst.lng]}
            eventHandlers={{
              click: () => {
                setInstituicaoSelecionada(inst.id)
              },
            }}
            ref={(ref) => {
              if (ref) {
                markerRefs.current[inst.id] = ref
              }
            }}
          >
            <Popup
              ref={(ref) => {
                if (ref) {
                  popupRefs.current[inst.id] = ref
                }
              }}
            >
              <div className="p-1">
                <h3 className="font-medium text-sky-900">{inst.nome}</h3>
                <p className="text-sm text-gray-600">{inst.endereco}</p>
                <p className="text-xs text-gray-500">
                  {inst.cidade}, {inst.estado}
                </p>
                <div className="mt-2">
                  <button
                    className="text-xs bg-sky-600 hover:bg-sky-700 text-white py-1 px-2 rounded transition-colors"
                    onClick={(e) => {
                      e.stopPropagation()
                      onAbrirDetalhesBox(inst.id)
                    }}
                  >
                    Ver detalhes
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
        <CenterMap instituicao={instituicaoAtiva} zoom={12} />
      </MapContainer>
      <DetalhesBox />
    </div>
  )
}