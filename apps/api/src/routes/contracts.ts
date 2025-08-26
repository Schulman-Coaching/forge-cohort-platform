import express from 'express';
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();

// GET /api/contracts - List all contracts
router.get('/', async (req, res) => {
  try {
    const contracts = await prisma.contract.findMany({
      include: {
        clauses: {
          include: {
            amendments: true,
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        cohort: true
      }
    });
    res.json(contracts);
  } catch (error) {
    console.error('Error fetching contracts:', error);
    res.status(500).json({ error: 'Failed to fetch contracts' });
  }
});

// POST /api/contracts - Create new contract
router.post('/', async (req, res) => {
  try {
    const { title, cohortId, clauses } = req.body;
    
    const newContract = await prisma.contract.create({
      data: {
        title,
        cohort: { connect: { id: cohortId } },
        clauses: {
          create: clauses?.map((clause: any) => ({
            title: clause.title,
            content: clause.content,
            createdBy: { connect: { id: clause.userId } }
          })) || []
        }
      },
      include: {
        clauses: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        cohort: true
      }
    });
    
    res.status(201).json(newContract);
  } catch (error) {
    console.error('Error creating contract:', error);
    res.status(500).json({ error: 'Failed to create contract' });
  }
});

// GET /api/contracts/:id - Get specific contract
router.get('/:id', async (req, res) => {
  try {
    const contract = await prisma.contract.findUnique({
      where: { id: req.params.id },
      include: {
        clauses: {
          include: {
            amendments: {
              include: {
                proposedBy: {
                  select: {
                    id: true,
                    name: true,
                    email: true
                  }
                }
              }
            },
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        cohort: {
          include: {
            members: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });
    
    if (!contract) {
      return res.status(404).json({ error: 'Contract not found' });
    }
    
    res.json(contract);
  } catch (error) {
    console.error('Error fetching contract:', error);
    res.status(500).json({ error: 'Failed to fetch contract' });
  }
});

// PUT /api/contracts/:id - Update contract
router.put('/:id', async (req, res) => {
  try {
    const { title } = req.body;
    
    const updatedContract = await prisma.contract.update({
      where: { id: req.params.id },
      data: { title },
      include: {
        clauses: {
          include: {
            createdBy: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        },
        cohort: true
      }
    });
    
    res.json(updatedContract);
  } catch (error) {
    console.error('Error updating contract:', error);
    res.status(500).json({ error: 'Failed to update contract' });
  }
});

// DELETE /api/contracts/:id - Delete contract
router.delete('/:id', async (req, res) => {
  try {
    await prisma.contract.delete({
      where: { id: req.params.id }
    });
    
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting contract:', error);
    res.status(500).json({ error: 'Failed to delete contract' });
  }
});

// POST /api/contracts/:id/clauses - Add clause to contract
router.post('/:id/clauses', async (req, res) => {
  try {
    const { title, content, userId } = req.body;
    
    const clause = await prisma.clause.create({
      data: {
        title,
        content,
        contract: { connect: { id: req.params.id } },
        createdBy: { connect: { id: userId } }
      },
      include: {
        createdBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    res.status(201).json(clause);
  } catch (error) {
    console.error('Error adding clause:', error);
    res.status(500).json({ error: 'Failed to add clause' });
  }
});

// POST /api/contracts/:id/amend - Propose amendment
router.post('/:id/amend', async (req, res) => {
  try {
    const { clauseId, content, userId } = req.body;
    
    const amendment = await prisma.amendment.create({
      data: {
        content,
        clause: { connect: { id: clauseId } },
        proposedBy: { connect: { id: userId } }
      },
      include: {
        proposedBy: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });
    
    res.status(201).json(amendment);
  } catch (error) {
    console.error('Error proposing amendment:', error);
    res.status(500).json({ error: 'Failed to propose amendment' });
  }
});

export default router;