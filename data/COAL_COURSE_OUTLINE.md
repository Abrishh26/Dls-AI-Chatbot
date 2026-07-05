# COAL Course Outline — Computer Organization & Assembly Language

Structured curriculum for Boolforge / Digital Logic Studio.  
Aligned with FAST-style COAL outlines and the [Academic-Time-Machine COAL repo](https://github.com/saleha-muzammil/Academic-Time-Machine/tree/main/COAL).

---

## Course at a Glance

| Item | Detail |
|------|--------|
| **Duration** | ~14 weeks |
| **Levels** | Beginner → Intermediate → Advanced |
| **Parts** | 7 major parts, 20 modules |
| **Prerequisite** | Basic digital logic (DLD foundation recommended) |
| **Primary ISA** | Intel x86 / IA-32 (with ARM/MIPS/RISC-V comparison) |

---

## Part 1 — Foundations (Beginner · 2 weeks)

### 1.1 Introduction to Computer Organization
- Organization vs architecture vs ISA
- Von Neumann model, CPU, memory, I/O, buses
- Why assembly language is taught in COAL

### 1.2 Number Systems & Data Representation
- Binary, decimal, octal, hexadecimal
- 1's and 2's complement, signed/unsigned
- BCD, ASCII, floating-point basics

### 1.3 Digital Logic Bridge
- Gates, adders, multiplexers in CPU context
- Flip-flops and registers
- Link to DLD modules on the platform

---

## Part 2 — Machine Model & Instruction Cycle (Beginner · 1.5 weeks)

### 2.1 CPU Components & Register Model
- ALU, control unit, PC, IR, GPRs
- Register file and temporary storage

### 2.2 Instruction Cycle
- Fetch → decode → execute → writeback
- Tracing programs by hand

### 2.3 Memory Organization & Hierarchy
- Registers, cache, RAM, secondary storage
- Addressing, stack preview, endianness intro

---

## Part 3 — ISA & Addressing (Intermediate · 2 weeks)

### 3.1 Instruction Set Architecture
- Instruction categories and formats
- Assembly vs machine language
- Program structure (.data, .code, main)

### 3.2 Addressing Modes
- Immediate, register, direct, indirect
- Indexed and base-indexed modes

### 3.3 Flags Register & Comparisons
- ZF, CF, OF, SF
- CMP, TEST, conditional branches

---

## Part 4 — Assembly Programming (Intermediate · 3 weeks)

### 4.1 Data Movement & Basic Instructions
- MOV, LEA, arithmetic, logic, shift/rotate

### 4.2 Control Flow
- JMP, conditional jumps, loops, if-else patterns

### 4.3 Registers, Memory & Operand Rules
- 16/32-bit registers, operand sizes, valid combinations

### 4.4 Procedures, Stack & Subroutines
- PUSH, POP, CALL, RET, parameters, recursion

### 4.5 Arrays, Strings & Advanced Instructions
- Indexed access, string instructions, sort/search routines

---

## Part 5 — x86 Architecture & Program Structure (Advanced · 2 weeks)

### 5.1 Intel IA-32 Architecture
- Register set, real vs protected mode
- Segmentation, paging overview, instruction encoding

### 5.2 Directives, Macros & Program Layout
- .DATA, .CODE, PROC, macros, build pipeline

### 5.3 Hardware–Software Interface
- Compiler → assembler → linker → loader
- Stack frames and calling conventions

---

## Part 6 — I/O, Interrupts & System Design (Advanced · 1.5 weeks)

### 6.1 I/O Methods & Interrupts
- Programmed I/O, interrupts, DMA
- IVT/IDT, interrupt service routines

### 6.2 Buses, Storage & RAID
- System buses, HDD/SSD, RAID overview

---

## Part 7 — Architecture Comparison & Performance (Advanced · 2 weeks)

### 7.1 Processor Families
- CISC vs RISC, x86, ARM, MIPS, RISC-V

### 7.2 Pipelining & Hazards
- 5-stage pipeline, structural/data/control hazards
- Performance metrics, superscalar intro

### 7.3 Capstone Integration
- End-to-end program analysis
- Finals and project preparation

---

## Assessment Alignment

| Assessment | Topics Covered |
|------------|----------------|
| **Assignment 1** | Number systems, syntax, MOV/ADD basics |
| **Assignment 2** | Addressing modes, macros, branching |
| **Assignment 3** | Procedures, arrays, strings |
| **Midterm 1** | Parts 1–3 + early Part 4 |
| **Midterm 2** | Control flow, procedures, IA-32, directives |
| **Final** | Full course including pipelining & architecture |

---

## Data to Attach Later

Place COAL textbook PDFs in this folder, then run:

```bash
cd Dls-AI-Chatbot
npm run ingest
```

Optional reference material from GitHub:
- Course Outlines (2018, 2020/2023, 2024)
- Assignments, Mids, Finals, Projects, Quizzes
