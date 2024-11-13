export default function VisibleTextBlock({
  currentStepIndex,
}: {
  currentStepIndex: number;
}) {
  const textBlocks = [
    "In this visualization, we see the impact of these actions. On the map, 100 landfills across Annex I countries have been capped (highlighted in green). There are a total 9,624 landfills tracked by Climate TRACE in the world – landfills that Scenario 1 has not affected are displayed in gray. Here, we might begin to question our first assumption of working locally – there are a lot of landfills outside of Annex I countries that we have ignored.",
    '',
    "The size of each circle on the map is proportional to the emissions that would be reduced if that landfill were capped. Despite being very large, many waste sites already have good practices in place that make for a low emissions intensity, or converting LFG into renewable energy. For example, in 2021, the Odayeri landfill in Turkey advanced its methane capture capabilities, converting the gas into thermal energy. Similarly, the closed Bandeirantes landfill in São Paulo, Brazil, uses a multi-layer cover system, featuring synthetic and clay layers, a gas collection layer beneath, and a vegetative cover on the surface, enhancing gas containment and environmental management.  Now, we can question our second assumption: The most-emitting landfills may not actually provide much return on our investment if their emissions intensity is already low.",
    "In the bar chart below, we sort all landfills in the world by the emissions reductions that would actually result in capping them. The chart shows the top 200 such landfills. In our current scenario, the 100 landfills that we’ve capped are sprinkled through the chart – many landfills in gray have huge potential, but weren’t capped in this scenario. Ultimately, Scenario 1 reduces emissions by 1.6 Gt, or 4.3% of all landfill emissions.",
    "Now, let us set the two assumptions of Scenario 1 (working locally and focusing on largest landfills), and instead ask the question more directly: With the budget to cover 100 landfills, which 100 landfills anywhere and regardless of current emissions would actually have the most impact if they were covered? To do this, we look at each landfill globally, and we look at their emissions factors and activity to see the actual effect of our actions (i.e. the emissions reduction potential).",
    "Without constraining ourselves to Annex I countries, many of the large gray circles across the map that we ignored in Scenario 1 have now been capped. In the bar chart, we see that the highest-potential 100 landfills have been precisely targeted. By looking at each landfill and measuring the emissions that might be reduced directly, we get a whopping 3.7 Gt  12% reduction in emissions, or  12% of all landfill emissions..",
  ];

  return (
    <div id="bubble-map-blurbs" className="__web-inspector-hide-shortcut__">
      {textBlocks.map((text, index) => (
        <p
          key={index}
          className={`bubble-map-blurb bubble-map-blurb-${index}`}
          style={{ display: currentStepIndex == index ? "block" : "none" }}
        >
          {text}
        </p>
      ))}
    </div>
  );
}
