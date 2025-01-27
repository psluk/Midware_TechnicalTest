import { ReactElement, SVGProps } from "react";

export function EvolutionArrow(props: SVGProps<SVGSVGElement>): ReactElement {
  // Source: https://www.svgrepo.com/svg/511428/arrow-right-365
  return (
    <svg viewBox="0 -5 20 20" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M298.803 6405.678l1.424 1.484a.494.494 0 01-.366.836h-15.027c-.557 0-.834.45-.834 1.002v-.008c0 .553.277 1.009.834 1.009h15.012c.445 0 .672.54.363.857l-1.416 1.46a.989.989 0 00.04 1.41l.002.005c.402.372 1.031.353 1.41-.043l3.204-3.343a1.992 1.992 0 00-.007-2.757l-3.176-3.283a1.003 1.003 0 00-1.402-.042l-.01.01a.985.985 0 00-.05 1.403"
        transform="translate(-340 -6564) translate(56 160)"
        fill="currentColor"
        stroke="none"
        strokeWidth={1}
        fillRule="evenodd"
        {...props}
      />
    </svg>
  );
}
