#!/usr/bin/env node

// Script to compile the Circom circuit for production use
// This generates the WASM file and proving/verification keys

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const util = require('util');

const execAsync = util.promisify(exec);

const CIRCUIT_NAME = 'data_integrity';
const CIRCUITS_DIR = path.join(__dirname, '../public/circuits');
const BUILD_DIR = path.join(CIRCUITS_DIR, 'build');

async function compileCircuit() {
  try {
    console.log('🔧 Compiling Circom circuit for production...');

    // Create build directory
    if (!fs.existsSync(BUILD_DIR)) {
      fs.mkdirSync(BUILD_DIR, { recursive: true });
    }

    // Step 1: Compile circuit to R1CS
    console.log('📝 Step 1: Compiling circuit to R1CS...');
    await execAsync(`circom ${CIRCUITS_DIR}/${CIRCUIT_NAME}.circom --r1cs --wasm --sym -o ${BUILD_DIR}`);

    // Step 2: Generate witness
    console.log('🔍 Step 2: Generating witness...');
    const witnessInput = {
      privateDataHash: "12345",
      encryptionKeyHash: "67890",
      publicDataHash: "24690", // Sum of private inputs for this simple example
      timestamp: Date.now(),
      userIDHash: "11111"
    };

    fs.writeFileSync(
      path.join(BUILD_DIR, 'input.json'),
      JSON.stringify(witnessInput, null, 2)
    );

    // Step 3: Setup ceremony (Powers of Tau)
    console.log('⚡ Step 3: Powers of Tau ceremony...');
    await execAsync(`snarkjs powersoftau new bn128 12 ${BUILD_DIR}/pot12_0000.ptau -v`);
    await execAsync(`snarkjs powersoftau contribute ${BUILD_DIR}/pot12_0000.ptau ${BUILD_DIR}/pot12_0001.ptau --name="First contribution" -v`);
    await execAsync(`snarkjs powersoftau prepare phase2 ${BUILD_DIR}/pot12_0001.ptau ${BUILD_DIR}/pot12_final.ptau -v`);

    // Step 4: Generate proving and verification keys
    console.log('🔑 Step 4: Generating proving and verification keys...');
    await execAsync(`snarkjs groth16 setup ${BUILD_DIR}/${CIRCUIT_NAME}.r1cs ${BUILD_DIR}/pot12_final.ptau ${BUILD_DIR}/${CIRCUIT_NAME}_0000.zkey`);
    await execAsync(`snarkjs zkey contribute ${BUILD_DIR}/${CIRCUIT_NAME}_0000.zkey ${BUILD_DIR}/${CIRCUIT_NAME}_final.zkey --name="First contribution" -v`);
    await execAsync(`snarkjs zkey export verificationkey ${BUILD_DIR}/${CIRCUIT_NAME}_final.zkey ${BUILD_DIR}/verification_key.json`);

    // Step 5: Copy files to public directory
    console.log('📁 Step 5: Copying files to public directory...');
    fs.copyFileSync(
      path.join(BUILD_DIR, `${CIRCUIT_NAME}_js`, `${CIRCUIT_NAME}.wasm`),
      path.join(CIRCUITS_DIR, `${CIRCUIT_NAME}.wasm`)
    );
    fs.copyFileSync(
      path.join(BUILD_DIR, `${CIRCUIT_NAME}_final.zkey`),
      path.join(CIRCUITS_DIR, `${CIRCUIT_NAME}_final.zkey`)
    );
    fs.copyFileSync(
      path.join(BUILD_DIR, 'verification_key.json'),
      path.join(CIRCUITS_DIR, 'verification_key.json')
    );

    console.log('✅ Circuit compilation completed successfully!');
    console.log('📋 Generated files:');
    console.log(`   - ${CIRCUIT_NAME}.wasm (circuit WebAssembly)`);
    console.log(`   - ${CIRCUIT_NAME}_final.zkey (proving key)`);
    console.log(`   - verification_key.json (verification key)`);

  } catch (error) {
    console.error('❌ Circuit compilation failed:', error);
    process.exit(1);
  }
}

// Run compilation
compileCircuit();