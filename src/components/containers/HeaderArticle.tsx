import ScrollIndicator from "../custom-ui-components/ScrollIndicator";

export default function HeaderArticle({
  shadowColor,
}: {
  shadowColor: string;
}) {
  return (
    <article className="  ">
      {/* vertical-align: baseline;
    background: transparent;
    max-width: 540px;
   
    font-weight: 400;
    font-size: 80px;
    line-height: 1.07;
    letter-spacing: .01em;
    margin: 16px 0 32px; */}

      <h1
        className="font-black max-w-[650px] text-[3rem] text-center m-auto tracking-wide  leading-[1.1]"
        style={{
          textShadow: `-1px -1px 0 ${shadowColor}, 1px -1px 0 ${shadowColor}, -1px 1px 0 ${shadowColor}, 1px 1px 0 ${shadowColor}`,
        }}
      >
        Accelerating global decarbonization through emissionality
      </h1>

      <h2 className="mt-4 mb-10 max-w-[650px] m-auto font-roboto text-center p-0 border-0 outline-none align-baseline uppercase font-normal text-[1rem] leading-[27px] tracking-[.03em]">
        an example from reducing landfill methane emissions
      </h2>
      <p className="max-w-[650px] m-auto ">
        Decarbonization strategies often base emissions-reduction interventions
        on two assumptions — working locally and focusing on the largest
        emitters. This inherently limits the impact these projects can have. A
        superior approach is called emissionality, a decarbonization strategy
        that focuses on investing in interventions that can yield the greatest
        emissions reduction, regardless of their physical location around the
        world.
      </p>
      <p className="max-w-[650px] m-auto">
        We review an example for a single sector, below, showing how
        emissionality can nearly triple real-world emissions reductions. Such
        projects deployed at scale and across sectors would have an additional
        decarbonization benefit measured in gigatons, annually.
      </p>

      <section className="max-w-[650px] m-auto">
        <h3 className="text-[1.5rem] font-semibold tracking-tight  text-left pt-10 ml-[-2px]">
          Example: Landfill methane emissions
        </h3>
        For this example, we focus on landfill methane emissions. Methane is a
        potent but shorter-lived greenhouse gas (GHG), with a global warming
        potential (GWP) some 85 times stronger than carbon dioxide on a 20-year
        time scale, and still 25 times stronger than CO2 on a 100-year time
        horizon. Thus, near-term methane emissions reductions can have an
        outsized beneficial influence on overall climate action.
      </section>
      <p className="max-w-[650px] m-auto">
        <br></br>
        The waste sector is one of the largest human-made sources of methane.
        Landfill emissions can be reduced in several ways, such as by upgrading
        a landfill from an unmanaged disposal site to a covered sanitary
        landfill.
        <br></br>
      </p>

      <p className="max-w-[650px] m-auto">
        <br></br>
        Capping landfills with various materials traps much of the methane they
        create, improving local air quality and preventing the methane from
        being directly released to the atmosphere where it contributes to the
        climate crisis. Capping also provides a pathway for capturing landfill
        gas (LFG), enabling LFG-to-energy uses, also.
        <br></br>
      </p>

      <section className="max-w-[650px] m-auto">
        <h3 className="text-[1.5rem] font-semibold tracking-tight  text-left pt-10 ml-[-2px]">
          What if we could cap 100 Landfills?
        </h3>
        Let’s imagine the funds and political will have come together amongst
        the UN’s Annex I (historically industrialized) nations to cap 100
        landfills. Climate TRACE uses AI and public data to track and
        characterize 9,624 landfills worldwide. The Annex I nations have
        recognized the potential to cut planet-heating emissions and are
        evaluating options for how to best prioritize this group of just over 1%
        of all landfills tracked by Climate TRACE.
      </section>
      <p className="max-w-[650px] m-auto">
        <h3 className="text-[1.5rem] font-semibold tracking-tight  text-left pt-10 ml-[-2px]">
          Scenario 1: Work locally, focusing on high emissions
        </h3>
        In our first scenario, these nations make two reasonable-seeming
        assumptions:
        <ol className="mt-4">
          <li className="ml-4">
            <strong>1. Work locally:</strong> Collective global climate action
            often focuses on countries taking steps to reduce their own
            individual emissions, such as through Nationally Determined
            Contributions (NDCs).
          </li>
          <li className="mt-2 ml-4">
            <strong>2. Focusing on most-emitting landfills:</strong> The largest
            landfills among Annex I countries would, at first glance, seem to be
            the best candidates to be capped.
          </li>
        </ol>
        <br></br>
        Now we evaluate the net climate impact of these assumptions.
      </p>

      <section className="relative h-[80px]">
        <ScrollIndicator color={shadowColor} />
      </section>
    </article>
  );
}
