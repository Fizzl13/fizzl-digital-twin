# FIZZL DIGITAL TWIN

A grounded AI professional profile that makes a CV conversational. Step 18 adds live API health detection and request timeouts.

## What it does
Visitors can ask questions about documented experience, skills, work style and projects. The system uses a controlled knowledge base and is designed not to invent qualifications or experience.

## Architecture
Knowledge Base → Semantic Retrieval / RAG → Claude API → Grounded Response

Supporting layers:
- Session conversation memory
- Confidence and source metadata
- Automated evaluation tests
- API security controls
- Responsive FIZZL web interface

## Stack
- Node.js
- HTML / CSS / JavaScript
- Claude API
- Semantic retrieval / RAG
- Session memory
- Automated AI evaluation
- Security middleware

## Project structure
- `server/` — API, retrieval, agent and security layer
- `evaluation/` — regression and automated AI tests
- `showcase/` — portfolio presentation
- `knowledge-base.json` — structured professional knowledge
- `.env.example` — environment configuration template

## Live demo
https://ai.fizzl.eu

## Portfolio
https://projects.fizzl.eu

## Author
Frits Zwager — FIZZL
