# Carrier Composition Judgment Actor

This Actor owns exactly one formula: whether a producer morphism's codomain
carrier is the same locus as a consumer morphism's domain carrier.

It MUST return a typed witness or obstruction. It MUST NOT execute either
morphism, search for alternate carriers, plan a workflow, mutate a registry,
or treat codec or verb-name similarity as carrier identity.
