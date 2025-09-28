const express = require('express');
const router = express.Router();

let professores = [
  { id: Date.now() + 11, nome: "Carlos Pereira", email: "carlos@example.com", cpf: "99988877766", disciplina: "Matemática" },
  { id: Date.now() + 12, nome: "Fernanda Lima", email: "fernanda@example.com", cpf: "44433322211", disciplina: "Português" }
];

function generateId(){
  return Date.now() + Math.floor(Math.random() * 1000);
}

// listar todos
router.get('/', (req, res) => {
  res.json(professores);
});

// buscar por id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const prof = professores.find(p => p.id === id);
  if(!prof) return res.status(404).json({ error: 'Professor não encontrado' });
  res.json(prof);
});

// criar novo
router.post('/', (req, res) => {
  const { nome, email, cpf, disciplina } = req.body;
  if(!nome || !email || !cpf || !disciplina) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, email, cpf, disciplina' });
  }
  if(professores.some(p => p.email === email)) {
    return res.status(409).json({ error: 'Email já cadastrado' });
  }
  if(professores.some(p => p.cpf === cpf)) {
    return res.status(409).json({ error: 'CPF já cadastrado' });
  }

  const newProf = { id: generateId(), nome, email, cpf, disciplina };
  professores.push(newProf);
  res.status(201).json(newProf);
});

// atualizar
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = professores.findIndex(p => p.id === id);
  if(idx === -1) return res.status(404).json({ error: 'Professor não encontrado' });

  const { nome, email, cpf, disciplina } = req.body;
  if(!nome || !email || !cpf || !disciplina) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, email, cpf, disciplina' });
  }

  if(professores.some(p => p.email === email && p.id !== id)) {
    return res.status(409).json({ error: 'Email já cadastrado por outro professor' });
  }
  if(professores.some(p => p.cpf === cpf && p.id !== id)) {
    return res.status(409).json({ error: 'CPF já cadastrado por outro professor' });
  }

  professores[idx] = { id, nome, email, cpf, disciplina };
  res.json(professores[idx]);
});

// deletar
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = professores.findIndex(p => p.id === id);
  if(idx === -1) return res.status(404).json({ error: 'Professor não encontrado' });
  professores.splice(idx, 1);
  res.status(204).send();
});

module.exports = router;
