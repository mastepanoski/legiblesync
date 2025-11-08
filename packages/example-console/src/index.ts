// index.ts
import { LegibleEngine } from '@legible-sync/core';
import { User } from './concepts/User';
import { Article } from './concepts/Article';
import { Favorite } from './concepts/Favorite';
import { Comment } from './concepts/Comment';
import { Password } from './concepts/Password';
import { JWT } from './concepts/JWT';
import { Web } from './concepts/Web';
import { Persistence } from './concepts/Persistence';
import { registrationSyncs } from './syncs/registration.sync';
import { persistenceSyncs } from './syncs/persistence.sync';
import { auditFlow, getFlowSummary } from './utils/audit';

async function main() {
  const engine = new LegibleEngine();

  // Registrar concepts
  engine.registerConcept("User", User);
  engine.registerConcept("Article", Article);
  engine.registerConcept("Favorite", Favorite);
  engine.registerConcept("Comment", Comment);
  engine.registerConcept("Password", Password);
  engine.registerConcept("JWT", JWT);
  engine.registerConcept("Web", Web);
  engine.registerConcept("Persistence", Persistence);

  // Registrar syncs - solo las de persistencia para evitar complejidad
  persistenceSyncs.forEach(s => engine.registerSync(s));

  const flow = "flow-1";

  console.log("🚀 Starting WYSIWID Legible Software Demo with Persistence\n");

  // Simular registro de usuario directamente (sin sincronizaciones complejas)
  console.log("📝 Registering user...");
  await engine.invoke("User", "register", {
    user: "user123",
    username: "alice",
    email: "a@mit.edu"
  }, flow);

  await engine.invoke("Password", "set", {
    user: "user123",
    password: "hashedpassword"
  }, flow);

  // Mostrar auditoría del flujo
  auditFlow(engine, flow);

  // Mostrar resumen
  const summary = getFlowSummary(engine, flow);
  console.log("📊 Flow Summary:");
  console.log(`   Actions: ${summary.totalActions}`);
  console.log(`   Concepts: ${summary.conceptsUsed.join(', ')}`);
  console.log(`   Success Rate: ${summary.successRate}%\n`);

  // Demostrar persistencia RDF
  console.log("🗄️  RDF/SPARQL Persistence Demo:");
  try {
    const queryResult = await engine.invoke("Persistence", "query", {
      query: { subject: "user_", predicate: "" }
    }, flow + "_query");

    console.log("Persisted user data:");
    console.log(JSON.stringify(queryResult.results, null, 2));
  } catch (error: any) {
    console.log("Persistence query failed:", error.message);
  }
  console.log();
}

main().catch(console.error);