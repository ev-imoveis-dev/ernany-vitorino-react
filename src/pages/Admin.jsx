import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createImovel } from "../services/imovelService";
import { getSessao } from "../services/authService";
import { getUsuarios, getCorretores } from "../services/usuarioService";
import { criarItemImagem, montarFormDataImovel } from "../utils/imovelFormData";

import {
  BedDouble,
  Bath,
  Square,
  Car,
  User,
  MapPin,
  Home,
  ArrowLeft,
  X,
  Image,
  LogOut,
} from "lucide-react";

const camposIniciais = {
  nome: "",
  referencia: "",
  tipo_imovel: "",
  tipo: "venda",
  valor: "",
  quartos: "",
  banheiros: "",
  tamanho: "",
  vagas: "",
  descricao: "",
  caracteristicas: "",
  corretor: "",
  localizacao: "",
  imagens: [],
};

export default function Admin() {
  const navigate = useNavigate();
  const sessao = useMemo(() => getSessao(), []);
  const papel = String(sessao?.usuario?.papel || "").toLowerCase();
  const usuarioId =
    sessao?.usuario?.id !== undefined && sessao?.usuario?.id !== null
      ? String(sessao.usuario.id)
      : "";
  const prefixo = papel === "admin" ? "/admin" : "/corretor";

  const [form, setForm] = useState(camposIniciais);
  const [enviando, setEnviando] = useState(false);
  const [sucesso, setSucesso] = useState(false);
  const [erro, setErro] = useState("");
  const [corretores, setCorretores] = useState([]);
  const [corretorSelecionado, setCorretorSelecionado] = useState(papel === 'admin' ? '' : usuarioId)
    const nomeUsuario = sessao?.usuario?.nome;


  useEffect(() => {
    if (papel === "admin") {
      getCorretores()
        .then((lista) => {
          const dados = Array.isArray(lista)
            ? lista
            : (lista?.dados ?? lista ?? []);
          const apenasCorretores = dados.filter(
            (u) => String(u.papel || "").toLowerCase() === "corretor",
          );
          setCorretores(apenasCorretores);
        })
        .catch((err) => {
          console.error("Erro ao carregar usuários:", err);
        });
    } else {
      
      setCorretorSelecionado(usuarioId);
      setForm((prev) => ({ ...prev, corretor: usuarioId }));
    }
  }, [papel, usuarioId]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleUpload(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (form.imagens.length + files.length > 20) {
      setErro("Você pode enviar no máximo 20 fotos por imóvel.");
      return;
    }

    files.forEach(file => {
      setForm((prev) => ({
        ...prev,
        imagens: [...prev.imagens, criarItemImagem(file)]
      }));
    });
  }

  function handleRemoveFoto(index) {
    setForm(prev => ({
      ...prev,
      imagens: prev.imagens.filter((_, i) => i !== index)
    }));
  }

  function handleLimpar() {
    setForm(camposIniciais);
    setSucesso(false);
    setErro("");

    if (papel === "admin") {
      setCorretorSelecionado("");
    } else {
      setCorretorSelecionado(usuarioId);
      setForm((prev) => ({ ...prev, corretor: usuarioId }));
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErro("");
    setSucesso(false);
    setEnviando(true);
    try {
      const payload = {
        ...form,
        valor:
          Number(String(form.valor).replace(/\D/g, "")) || Number(form.valor),
        quartos: form.quartos ? Number(form.quartos) : undefined,
        banheiros: form.banheiros ? Number(form.banheiros) : undefined,
        tamanho: form.tamanho ? Number(form.tamanho) : undefined,
        vagas: form.vagas ? Number(form.vagas) : undefined,
      };

      const extras = {
        corretor: papel === 'corretor' ? usuarioId : (corretorSelecionado?.trim() || null),
      }

      await createImovel(montarFormDataImovel(payload, extras));
      setSucesso(true);
      setTimeout(() => {
        navigate(`${prefixo}/imoveis`);
      }, 700);
    } catch (err) {
      console.error("Erro ao criar imóvel:", err);
      setErro(err?.message || "Erro ao cadastrar imóvel. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div className="min-h-screen bg-light pt-24 pb-16 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => navigate(prefixo)}
            className="flex items-center gap-2 text-primary font-medium hover:opacity-70 transition-opacity"
          >
            <ArrowLeft size={18} /> Voltar ao Dashboard
          </button>
        </div>

        <div className="mb-8">
          <h1 className="text-4xl font-serif font-bold text-primary">
            Cadastrar Imóvel
          </h1>
        </div>

        {sucesso && (
          <div className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 flex items-center justify-between">
            <span className="font-medium">Imóvel cadastrado com sucesso!</span>
            <button onClick={() => setSucesso(false)}>
              <X size={18} />
            </button>
          </div>
        )}

        {erro && (
          <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-4 mb-6 flex items-center justify-between">
            <span>{erro}</span>
            <button onClick={() => setErro("")}>
              <X size={18} />
            </button>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Nome do imóvel <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nome"
                value={form.nome}
                onChange={handleChange}
                placeholder="Ex.: Apartamento no Centro"
                
                className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Fotos do imóvel (Máximo 20)
              </label>
              
              <label className="block border-2 border-dashed border-gray-200 rounded-xl p-8 text-center cursor-pointer hover:border-secondary transition-colors mb-4">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleUpload}
                  className="hidden"
                />
                <Image size={32} className="text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-400">
                  Clique para selecionar fotos (Até 20)
                </p>
              </label>

              {form.imagens.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
                  {form.imagens.map((foto, index) => (
                    <div key={index} className="relative group aspect-square">
                      <img
                        src={foto.preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover rounded-xl border border-gray-100"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveFoto(index)}
                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                      <div className="absolute bottom-2 left-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">
                        {index + 1}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Tipo do imóvel *
                </label>
                <select
                  name="tipo_imovel"
                  value={form.tipo_imovel}
                  onChange={handleChange}
                  
                  className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="">Selecione</option>
                  <option value="Casa">Casa</option>
                  <option value="Apartamento">Apartamento</option>
                  <option value="Cobertura">Cobertura</option>
                  <option value="Terreno">Terreno</option>
                  <option value="Comercial">Comercial</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Finalidade *
                </label>
                <select
                  name="tipo"
                  value={form.tipo}
                  onChange={handleChange}
                  
                  className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                >
                  <option value="venda">Venda</option>
                  <option value="aluguel">Aluguel</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Valor (R$) *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="valor"
                    value={form.valor}
                    onChange={handleChange}
                    placeholder="Ex.: 350000"
                    
                    min="0"
                    className="w-full bg-light p-3 pr-12 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-bold">
                    R$
                  </span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                {
                  label: "Quartos",
                  name: "quartos",
                  icon: BedDouble,
                  placeholder: "Ex.: 3",
                },
                {
                  label: "Banheiros",
                  name: "banheiros",
                  icon: Bath,
                  placeholder: "Ex.: 2",
                },
                {
                  label: "Tamanho (m²)",
                  name: "tamanho",
                  icon: Square,
                  placeholder: "Ex.: 120",
                },
                {
                  label: "Vagas",
                  name: "vagas",
                  icon: Car,
                  placeholder: "Ex.: 1",
                },
              ].map(({ label, name, icon: Icon, placeholder }) => (
                <div key={name}>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {label}
                  </label>
                  <div className="relative">
                    <Icon
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                    />
                    <input
                      type="number"
                      name={name}
                      value={form[name]}
                      onChange={handleChange}
                      placeholder={placeholder}
                      min="0"
                      className="w-full bg-light p-3 pl-9 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Descrição
              </label>
              <textarea
                name="descricao"
                value={form.descricao}
                onChange={handleChange}
                placeholder="Descreva o imóvel..."
                rows={4}
                className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-2">
                Características
              </label>
              <input
                type="text"
                name="caracteristicas"
                value={form.caracteristicas}
                onChange={handleChange}
                placeholder="Ex.: Varanda, Churrasqueira, Piscina..."
                className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {papel === "admin" && (
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Corretor responsável
                  </label>
                  <select
                    value={corretorSelecionado}
                    onChange={e => {
                      setCorretorSelecionado(e.target.value)
                      setForm(prev => ({ ...prev, corretor: e.target.value }))
                    }}
                    className="w-full bg-light p-3 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  >
                    {/* <option value="">Ficar comigo (admin)</option> */}
                    <option value="">{nomeUsuario}</option>
                    {corretores.map(c => (
                      <option key={c.id} value={String(c.id)}>
                        {c.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}


              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Localização
                </label>
                <div className="relative">
                  <MapPin
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-300"
                  />
                  <input
                    type="text"
                    name="localizacao"
                    value={form.localizacao}
                    onChange={handleChange}
                    placeholder="Ex.: Praia do Morro, Guarapari - ES"
                    className="w-full bg-light p-3 pl-9 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-secondary"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={handleLimpar}
                className="px-6 py-3 rounded-xl border border-gray-200 text-gray-500 font-bold text-sm hover:bg-light transition-colors"
              >
                Limpar
              </button>
              <button
                type="submit"
                disabled={enviando}
                className="flex items-center gap-2 bg-primary text-white font-bold px-8 py-3 rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                <Home size={16} />
                {enviando ? "Cadastrando..." : "Cadastrar Imóvel"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
