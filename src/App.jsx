import { useEffect, useMemo, useState } from 'react'
import './App.css'

const API_BASE = 'https://pokeapi.co/api/v2'
const LIST_LIMIT = 60

const idFromUrl = (url) => {
  const parts = url.split('/').filter(Boolean)
  return Number(parts[parts.length - 1])
}

const formatId = (id) => `#${String(id).padStart(3, '0')}`

const statLabelMap = {
  hp: 'HP',
  attack: 'ATK',
  defense: 'DEF',
  'special-attack': 'SpA',
  'special-defense': 'SpD',
  speed: 'SPD',
}

function App() {
  const [view, setView] = useState('pokedex')
  const [query, setQuery] = useState('')
  const [list, setList] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [detail, setDetail] = useState(null)
  const [loadingList, setLoadingList] = useState(true)
  const [loadingDetail, setLoadingDetail] = useState(false)
  const [error, setError] = useState('')
  const [team, setTeam] = useState(() => {
    const stored = localStorage.getItem('p2h1-team')
    return stored ? JSON.parse(stored) : []
  })

  useEffect(() => {
    let isMounted = true
    setLoadingList(true)
    setError('')

    fetch(`${API_BASE}/pokemon?limit=${LIST_LIMIT}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load list')
        }
        return response.json()
      })
      .then((data) => {
        if (!isMounted) return
        const nextList = data.results.map((item) => ({
          ...item,
          id: idFromUrl(item.url),
        }))
        setList(nextList)
      })
      .catch(() => {
        if (!isMounted) return
        setError('No pudimos cargar la lista. Intenta de nuevo.')
      })
      .finally(() => {
        if (!isMounted) return
        setLoadingList(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('p2h1-team', JSON.stringify(team))
  }, [team])

  useEffect(() => {
    if (!selectedId) return
    let isMounted = true
    setLoadingDetail(true)
    setError('')

    fetch(`${API_BASE}/pokemon/${selectedId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load detail')
        }
        return response.json()
      })
      .then((data) => {
        if (!isMounted) return
        setDetail(data)
      })
      .catch(() => {
        if (!isMounted) return
        setError('No pudimos cargar el detalle. Intenta de nuevo.')
      })
      .finally(() => {
        if (!isMounted) return
        setLoadingDetail(false)
      })

    return () => {
      isMounted = false
    }
  }, [selectedId])

  const filteredList = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return list
    return list.filter((item) => item.name.includes(normalized))
  }, [list, query])

  const handleSelect = (id) => {
    setSelectedId(id)
    setView('detail')
  }

  const handleAddToTeam = () => {
    if (!detail) return
    if (team.some((member) => member.id === detail.id)) return

    setTeam((prev) => [
      ...prev,
      {
        id: detail.id,
        name: detail.name,
        sprite: detail.sprites?.other?.['official-artwork']?.front_default,
      },
    ])
  }

  const handleRemoveFromTeam = (id) => {
    setTeam((prev) => prev.filter((member) => member.id !== id))
  }

  const isOnTeam = detail ? team.some((member) => member.id === detail.id) : false

  return (
    <div className="app">
      <header className="hero fade-in" style={{ '--delay': '60ms' }}>
        <div className="hero-badge">P2H1 Spec-Driven + Spec Kit</div>
        <h1>Pokedex Atlas</h1>
        <p>
          Explora {LIST_LIMIT} criaturas y arma tu equipo. Datos en vivo desde
          PokeAPI.
        </p>
        <div className="hero-actions">
          <button
            className={view === 'pokedex' ? 'tab active' : 'tab'}
            type="button"
            onClick={() => setView('pokedex')}
          >
            Pokedex
          </button>
          <button
            className={view === 'detail' ? 'tab active' : 'tab'}
            type="button"
            onClick={() => setView('detail')}
            disabled={!selectedId}
          >
            Detalle
          </button>
          <button
            className={view === 'team' ? 'tab active' : 'tab'}
            type="button"
            onClick={() => setView('team')}
          >
            Equipo ({team.length})
          </button>
        </div>
      </header>

      <section className="content">
        {error ? <div className="status error">{error}</div> : null}

        {view === 'pokedex' ? (
          <div className="panel fade-in" style={{ '--delay': '120ms' }}>
            <div className="panel-header">
              <div>
                <h2>Lista base</h2>
                <p>Busca por nombre, selecciona para ver detalle.</p>
              </div>
              <div className="search">
                <input
                  type="search"
                  placeholder="Buscar pokemon..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>

            {loadingList ? (
              <div className="status">Cargando lista...</div>
            ) : (
              <div className="grid">
                {filteredList.map((item) => (
                  <button
                    type="button"
                    key={item.id}
                    className="card"
                    onClick={() => handleSelect(item.id)}
                  >
                    <div className="card-media">
                      <img
                        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${item.id}.png`}
                        alt={item.name}
                        loading="lazy"
                      />
                    </div>
                    <div className="card-body">
                      <span className="id">{formatId(item.id)}</span>
                      <strong>{item.name}</strong>
                      <span className="cta">Ver detalle</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : null}

        {view === 'detail' ? (
          <div className="panel fade-in" style={{ '--delay': '140ms' }}>
            {!selectedId ? (
              <div className="status">Selecciona un pokemon en la lista.</div>
            ) : loadingDetail || !detail ? (
              <div className="status">Cargando detalle...</div>
            ) : (
              <div className="detail">
                <div className="detail-hero">
                  <div className="detail-media">
                    <img
                      src={
                        detail.sprites?.other?.['official-artwork']?.front_default
                      }
                      alt={detail.name}
                    />
                  </div>
                  <div className="detail-main">
                    <span className="id">{formatId(detail.id)}</span>
                    <h2>{detail.name}</h2>
                    <div className="chips">
                      {detail.types.map((type) => (
                        <span className="chip" key={type.type.name}>
                          {type.type.name}
                        </span>
                      ))}
                    </div>
                    <div className="detail-actions">
                      <button
                        className="primary"
                        type="button"
                        onClick={handleAddToTeam}
                        disabled={isOnTeam}
                      >
                        {isOnTeam ? 'En equipo' : 'Agregar al equipo'}
                      </button>
                      <button
                        className="ghost"
                        type="button"
                        onClick={() => setView('pokedex')}
                      >
                        Volver a lista
                      </button>
                    </div>
                  </div>
                </div>

                <div className="detail-grid">
                  <div className="detail-card">
                    <h3>Info rapida</h3>
                    <ul>
                      <li>
                        <span>Altura</span>
                        <strong>{detail.height / 10} m</strong>
                      </li>
                      <li>
                        <span>Peso</span>
                        <strong>{detail.weight / 10} kg</strong>
                      </li>
                      <li>
                        <span>Habilidades</span>
                        <strong>
                          {detail.abilities
                            .map((ability) => ability.ability.name)
                            .join(', ')}
                        </strong>
                      </li>
                    </ul>
                  </div>
                  <div className="detail-card">
                    <h3>Stats base</h3>
                    <div className="stats">
                      {detail.stats.map((stat) => (
                        <div className="stat" key={stat.stat.name}>
                          <span>{statLabelMap[stat.stat.name] || stat.stat.name}</span>
                          <div className="meter">
                            <div
                              className="meter-fill"
                              style={{
                                width: `${Math.min(stat.base_stat, 160)}px`,
                              }}
                            ></div>
                          </div>
                          <strong>{stat.base_stat}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : null}

        {view === 'team' ? (
          <div className="panel fade-in" style={{ '--delay': '160ms' }}>
            <div className="panel-header">
              <div>
                <h2>Equipo activo</h2>
                <p>Guarda hasta 6 favoritos para tu sesion.</p>
              </div>
              <button
                type="button"
                className="ghost"
                onClick={() => setTeam([])}
                disabled={team.length === 0}
              >
                Limpiar equipo
              </button>
            </div>

            {team.length === 0 ? (
              <div className="status">No hay pokemon en tu equipo.</div>
            ) : (
              <div className="grid team">
                {team.map((member) => (
                  <div className="card" key={member.id}>
                    <div className="card-media">
                      <img src={member.sprite} alt={member.name} />
                    </div>
                    <div className="card-body">
                      <span className="id">{formatId(member.id)}</span>
                      <strong>{member.name}</strong>
                      <button
                        type="button"
                        className="ghost small"
                        onClick={() => handleRemoveFromTeam(member.id)}
                      >
                        Quitar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </section>
    </div>
  )
}

export default App
