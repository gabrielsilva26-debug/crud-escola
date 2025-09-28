const express = require('express');
const router = express.Router();

// dados em memória com 2 exemplos
let alunos = [
  { id: Date.now() + 1, nome: "Ana Silva", email: "ana@example.com", cpf: "11122233344", curso: "Engenharia" },
  { id: Date.now() + 2, nome: "Bruno Souza", email: "bruno@example.com", cpf: "55566677788", curso: "Administração" }
];

function generateId(){
  return Date.now() + Math.floor(Math.random() * 1000);
}

// listar todos
router.get('/', (req, res) => {
  res.json(alunos);
});

// buscar por id
router.get('/:id', (req, res) => {
  const id = Number(req.params.id);
  const aluno = alunos.find(a => a.id === id);
  if(!aluno) return res.status(404).json({ error: 'Aluno não encontrado' });
  res.json(aluno);
});

// criar novo
router.post('/', (req, res) => {
  const { nome, email, cpf, curso } = req.body;
  if(!nome || !email || !cpf || !curso) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, email, cpf, curso' });
  }
  // checar duplicidade email/cpf
  if(alunos.some(a => a.email === email)) {
    return res.status(409).json({ error: 'Email já cadastrado' });
  }
  if(alunos.some(a => a.cpf === cpf)) {
    return res.status(409).json({ error: 'CPF já cadastrado' });
  }

  const newAluno = { id: generateId(), nome, email, cpf, curso };
  alunos.push(newAluno);
  res.status(201).json(newAluno);
});

// atualizar
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = alunos.findIndex(a => a.id === id);
  if(idx === -1) return res.status(404).json({ error: 'Aluno não encontrado' });

  const { nome, email, cpf, curso } = req.body;
  if(!nome || !email || !cpf || !curso) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, email, cpf, curso' });
  }

  // checar duplicidade em outro registro
  if(alunos.some(a => a.email === email && a.id !== id)) {
    return res.status(409).json({ error: 'Email já cadastrado por outro aluno' });
  }
  if(alunos.some(a => a.cpf === cpf && a.id !== id)) {
    return res.status(409).json({ error: 'CPF já cadastrado por outro aluno' });
  }

  alunos[idx] = { id, nome, email, cpf, curso };
  res.json(alunos[idx]);
});

// deletar
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  const idx = alunos.findIndex(a => a.id === id);
  if(idx === -1) return res.status(404).json({ error: 'Aluno não encontrado' });
  alunos.splice(idx, 1);
  res.status(204).send();
});

module.exports = router;