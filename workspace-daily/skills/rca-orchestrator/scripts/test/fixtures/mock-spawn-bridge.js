module.exports.spawnBatch = async function spawnBatch(requests) {
  return requests.map((request, index) => ({
    issue_key: request.source.issue_key,
    label: request.request.label,
    status: 'completed',
    started_at: `2026-03-10T08:0${index}:00Z`,
    finished_at: `2026-03-10T08:0${index}:30Z`,
    output_file: request.handoff.result_contract.expected_outputs[0],
  }));
};
