import PrivacyPolicyView from "@/features/policies/components/privacy-policy-view";

export default function StandalonePrivacyPolicyPage() {
  return (
    <div className="w-full padding-x py-10 min-h-screen bg-[#F7F7F7]">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 md:p-10 shadow-xs border border-gray-100">
        <PrivacyPolicyView />
      </div>
    </div>
  );
}
